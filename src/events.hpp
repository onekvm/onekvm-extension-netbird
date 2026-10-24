#pragma once

#include <algorithm>
#include <cstdint>
#include <poll.h>
#include <sys/inotify.h>
#include <sys/signalfd.h>
#include <sys/socket.h>
#include <sys/time.h>
#include <sys/timerfd.h>
#include <sys/file.h>
#include <sys/un.h>
#include <fcntl.h>
#include <signal.h>
#include <unistd.h>
#include <cerrno>
#include <chrono>
#include <cstring>
#include <filesystem>
#include <string>
#include <string_view>

namespace events {
#ifndef ONEKVM_AUTH_WINDOW_SECONDS
#define ONEKVM_AUTH_WINDOW_SECONDS 300
#endif
inline constexpr int AuthWindowSeconds = ONEKVM_AUTH_WINDOW_SECONDS;
static_assert(AuthWindowSeconds > 0 && AuthWindowSeconds <= 300);

// A one-shot monotonic event, independent of UI entry and wall-clock changes.
class AuthorizationDeadline {
 public:
  int fd = timerfd_create(CLOCK_MONOTONIC, TFD_CLOEXEC | TFD_NONBLOCK);
  ~AuthorizationDeadline() { if (fd >= 0) close(fd); }
  bool arm() {
    itimerspec timer{};
    timer.it_value.tv_sec = AuthWindowSeconds;
    return timerfd_settime(fd, 0, &timer, nullptr) == 0;
  }
  void clear() {
    itimerspec timer{};
    (void)timerfd_settime(fd, 0, &timer, nullptr);
  }
  bool expired() {
    std::uint64_t count = 0;
    return read(fd, &count, sizeof(count)) == sizeof(count) && count > 0;
  }
  static std::int64_t expiresAt() {
    return std::chrono::duration_cast<std::chrono::milliseconds>(
      std::chrono::system_clock::now().time_since_epoch()).count() + AuthWindowSeconds * 1000;
  }
};

// Serialize command publishers so simultaneous connect calls share one request.
class AuthorizationLock {
 public:
  int fd = -1;
  explicit AuthorizationLock(const std::string &data) {
    fd = ::open((data + "/oauth-request.lock").c_str(), O_CREAT | O_RDWR | O_CLOEXEC, 0600);
    if (fd >= 0 && flock(fd, LOCK_EX) != 0) { close(fd); fd = -1; }
  }
  ~AuthorizationLock() { if (fd >= 0) close(fd); }
};

inline void ChildSignals() {
  sigset_t empty;
  sigemptyset(&empty);
  sigprocmask(SIG_SETMASK, &empty, nullptr);
}

// Readiness and file replacement wake the supervisor; idle services block.
class Watch {
 public:
  int files = -1, signals = -1;
  sigset_t previous{};
  Watch(const std::string &data, const std::string &sockets) {
    std::filesystem::create_directories(data);
    std::filesystem::create_directories(sockets);
    files = inotify_init1(IN_CLOEXEC | IN_NONBLOCK);
    constexpr auto mask = IN_CLOSE_WRITE | IN_MODIFY | IN_MOVED_TO | IN_DELETE | IN_CREATE;
    if (files >= 0 && (inotify_add_watch(files, data.c_str(), mask) < 0 ||
                      inotify_add_watch(files, sockets.c_str(), mask) < 0)) {
      close(files); files = -1;
    }
    sigset_t blocked;
    sigemptyset(&blocked);
    for (int signal : {SIGCHLD, SIGTERM, SIGINT}) sigaddset(&blocked, signal);
    sigprocmask(SIG_BLOCK, &blocked, &previous);
    signals = signalfd(-1, &blocked, SFD_CLOEXEC | SFD_NONBLOCK);
  }
  ~Watch() {
    if (files >= 0) close(files);
    if (signals >= 0) close(signals);
    sigprocmask(SIG_SETMASK, &previous, nullptr);
  }
  bool valid() const { return files >= 0 && signals >= 0; }
  bool drainFiles() {
    bool relevant = false;
    alignas(inotify_event) char buffer[8192];
    for (;;) {
      const ssize_t count = read(files, buffer, sizeof(buffer));
      if (count < 0 && errno == EINTR) continue;
      if (count <= 0) break;
      for (std::size_t offset = 0; offset < static_cast<std::size_t>(count);) {
        const auto *event = reinterpret_cast<const inotify_event *>(buffer + offset);
        const std::string_view name = event->len ? event->name : "";
        if (name == "oauth-wanted" || name == "oauth-output" || name == "oauth-state" ||
            (event->mask & IN_Q_OVERFLOW)) relevant = true;
        offset += sizeof(inotify_event) + event->len;
      }
    }
    return relevant;
  }
  bool stopping() {
    bool stop = false;
    signalfd_siginfo info{};
    while (read(signals, &info, sizeof(info)) == sizeof(info))
      if (info.ssi_signo == SIGTERM || info.ssi_signo == SIGINT) stop = true;
    return stop;
  }
};

// Both daemons expose newline-delimited JSON over a private Unix socket.
// HTTP/1.0 avoids chunk framing. Only transport failure uses reconnect backoff.
class Stream {
 public:
  int fd = -1;
  std::string buffer, last;
  bool headers = false;
  std::chrono::steady_clock::time_point retry{};
  ~Stream() { reset(); }
  void reset() {
    if (fd >= 0) close(fd);
    fd = -1; buffer.clear(); last.clear(); headers = false;
    retry = std::chrono::steady_clock::now() + std::chrono::seconds(2);
  }
  int timeout() const {
    if (fd >= 0) return -1;
    const auto remaining = std::chrono::duration_cast<std::chrono::milliseconds>(retry - std::chrono::steady_clock::now()).count();
    return static_cast<int>(std::max<std::int64_t>(0, remaining));
  }
  void open(const std::string &path, const std::string &request) {
    if (fd >= 0 || timeout() > 0) return;
    sockaddr_un address{};
    if (path.size() >= sizeof(address.sun_path)) { reset(); return; }
    fd = socket(AF_UNIX, SOCK_STREAM | SOCK_CLOEXEC, 0);
    if (fd < 0) { reset(); return; }
    address.sun_family = AF_UNIX;
    std::memcpy(address.sun_path, path.c_str(), path.size() + 1);
    struct timeval socket_timeout{.tv_sec = 2, .tv_usec = 0};
    setsockopt(fd, SOL_SOCKET, SO_SNDTIMEO, &socket_timeout, sizeof(socket_timeout));
    if (connect(fd, reinterpret_cast<sockaddr *>(&address), sizeof(address)) < 0) { reset(); return; }
    std::string_view rest(request);
    while (!rest.empty()) {
      const ssize_t n = send(fd, rest.data(), rest.size(), MSG_NOSIGNAL);
      if (n < 0 && errno == EINTR) continue;
      if (n <= 0) { reset(); return; }
      rest.remove_prefix(static_cast<std::size_t>(n));
    }
    fcntl(fd, F_SETFL, fcntl(fd, F_GETFL) | O_NONBLOCK);
  }
  bool read() {
    bool changed = false;
    char bytes[8192];
    for (;;) {
      const ssize_t n = recv(fd, bytes, sizeof(bytes), 0);
      if (n < 0 && errno == EINTR) continue;
      if (n < 0 && (errno == EAGAIN || errno == EWOULDBLOCK)) break;
      if (n <= 0) { reset(); return true; }
      buffer.append(bytes, static_cast<std::size_t>(n));
      if (buffer.size() > (1U << 20)) { reset(); return true; }
      if (!headers) {
        const auto end = buffer.find("\r\n\r\n");
        if (end == std::string::npos) continue;
        if (buffer.rfind("HTTP/1.0 200", 0) != 0 && buffer.rfind("HTTP/1.1 200", 0) != 0) { reset(); return true; }
        buffer.erase(0, end + 4);
        headers = true;
      }
      for (;;) {
        const auto end = buffer.find('\n');
        if (end == std::string::npos) break;
        std::string line = buffer.substr(0, end);
        buffer.erase(0, end + 1);
        json_object *message = json_tokener_parse(line.c_str());
        json_object *error = nullptr;
        const bool valid = message && json_object_is_type(message, json_type_object) &&
                           !json_object_object_get_ex(message, "error", &error);
        if (message) json_object_put(message);
        if (!valid) { reset(); return true; }
        if (line != last) { last = std::move(line); changed = true; }
      }
    }
    return changed;
  }
};

inline bool WaitForSocket(const std::string &path, std::string &error) {
  const std::string parent = std::filesystem::path(path).parent_path();
  std::filesystem::create_directories(parent);
  const int fd = inotify_init1(IN_CLOEXEC | IN_NONBLOCK);
  if (fd < 0 || inotify_add_watch(fd, parent.c_str(), IN_CREATE | IN_MOVED_TO) < 0) {
    if (fd >= 0) close(fd);
    error = "watch daemon socket: " + std::string(std::strerror(errno)); return false;
  }
  const auto deadline = std::chrono::steady_clock::now() + std::chrono::seconds(10);
  bool ready = false;
  while (!(ready = std::filesystem::exists(path))) {
    const auto remaining = std::chrono::duration_cast<std::chrono::milliseconds>(deadline - std::chrono::steady_clock::now()).count();
    if (remaining <= 0) break;
    pollfd item{fd, POLLIN, 0};
    if (poll(&item, 1, static_cast<int>(remaining)) < 0 && errno != EINTR) break;
    char buffer[4096];
    while (read(fd, buffer, sizeof(buffer)) > 0) {}
  }
  close(fd);
  if (!ready) error = "daemon socket did not become ready";
  return ready;
}
} // namespace events
