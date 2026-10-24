#include <json-c/json.h>
#include "events.hpp"

#include <fcntl.h>
#include <signal.h>
#include <sys/stat.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <sys/un.h>
#include <sys/wait.h>
#include <unistd.h>

#include <cerrno>
#include <chrono>
#include <cctype>
#include <cstdlib>
#include <cstring>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <iterator>
#include <string>
#include <string_view>
#include <thread>
#include <vector>

namespace {

struct Settings {
  std::string setup_key;
  std::string hostname = "onekvm";
  std::string management_url;
  int wireguard_port = 51820;
};

struct AuthorizationState { std::string state, url; std::int64_t expires_at = 0; };
AuthorizationState ReadAuthorization(bool connected);
void WriteOAuthState(const std::string &token, const std::string &state,
                     std::int64_t expires_at = 0, std::string_view deadline_url = {});
std::string ReadOAuthWanted();
void RemoveOAuthOutput();

std::string EnvironmentPath(const char *name, std::string_view fallback) {
  const char *value = std::getenv(name);
  return value != nullptr && *value != '\0' ? value : std::string(fallback);
}

std::string ConfigPath() {
  return EnvironmentPath("ONEKVM_EXTENSION_CONFIG",
                         "/run/onekvm/extensions/netbird") +
         "/config.json";
}

std::string DataPath() {
  return EnvironmentPath("ONEKVM_EXTENSION_DATA",
                         "/data/onekvm/extensions/netbird");
}

std::string SocketPath() {
  return EnvironmentPath("ONEKVM_EXTENSION_SOCKET",
                         "/run/onekvm/extensions/netbird/sockets");
}

bool ReadFile(const std::string &path, bool allow_missing, std::string &data,
              std::string &error) {
  std::ifstream input(path, std::ios::binary);
  if (!input) {
    if (allow_missing && errno == ENOENT)
      return true;
    error = "open " + path + ": " + std::strerror(errno);
    return false;
  }
  data.assign(std::istreambuf_iterator<char>(input),
              std::istreambuf_iterator<char>());
  if (data.size() > (1U << 20)) {
    error = path + " exceeds 1 MiB";
    return false;
  }
  return true;
}

json_object *ParseJSON(std::string_view input, std::string &error) {
  json_tokener *tokener = json_tokener_new_ex(32);
  if (tokener == nullptr) {
    error = "allocate JSON parser";
    return nullptr;
  }
  json_tokener_set_flags(tokener, JSON_TOKENER_STRICT);
  json_object *value = json_tokener_parse_ex(
      tokener, input.data(), static_cast<int>(input.size()));
  const auto status = json_tokener_get_error(tokener);
  std::size_t end = json_tokener_get_parse_end(tokener);
  json_tokener_free(tokener);
  while (end < input.size() &&
         std::isspace(static_cast<unsigned char>(input[end])))
    ++end;
  if (status != json_tokener_success || value == nullptr ||
      end != input.size()) {
    if (value != nullptr)
      json_object_put(value);
    error = "invalid JSON";
    return nullptr;
  }
  return value;
}

bool OptionalString(json_object *root, const char *name, std::string &output) {
  json_object *value = nullptr;
  if (!json_object_object_get_ex(root, name, &value))
    return true;
  if (!json_object_is_type(value, json_type_string))
    return false;
  output = json_object_get_string(value);
  return true;
}

bool OptionalInt(json_object *root, const char *name, int &output) {
  json_object *value = nullptr;
  if (!json_object_object_get_ex(root, name, &value))
    return true;
  if (!json_object_is_type(value, json_type_int))
    return false;
  output = json_object_get_int(value);
  return true;
}

bool LoadSettings(bool allow_missing, Settings &settings, std::string &error) {
  std::string input;
  if (!ReadFile(ConfigPath(), allow_missing, input, error))
    return false;
  if (input.empty())
    return true;
  json_object *root = ParseJSON(input, error);
  if (root == nullptr)
    return false;
  const bool valid =
      json_object_is_type(root, json_type_object) &&
      OptionalString(root, "setup_key", settings.setup_key) &&
      OptionalString(root, "hostname", settings.hostname) &&
      OptionalString(root, "management_url", settings.management_url) &&
      OptionalInt(root, "wireguard_port", settings.wireguard_port);
  json_object_put(root);
  if (!valid || settings.setup_key.size() > 4096 ||
      settings.hostname.size() > 253 || settings.management_url.size() > 2048 ||
      settings.wireguard_port < 0 || settings.wireguard_port > 65535) {
    error = "invalid NetBird settings";
    return false;
  }
  return true;
}

std::string Executable(std::string_view name) {
  if (name == "netbird")
    return EnvironmentPath("ONEKVM_NETBIRD", "/usr/bin/netbird");
  return std::string(name);
}

bool RuntimeReady(std::string &error) {
  if (access(Executable("netbird").c_str(), X_OK) != 0) {
    error = "NetBird runtime is missing or not executable; reinstall the runtime package";
    return false;
  }
  return true;
}

[[noreturn]] void Exec(std::vector<std::string> arguments) {
  events::ChildSignals();
  std::vector<char *> values;
  values.reserve(arguments.size() + 1);
  for (std::string &argument : arguments)
    values.push_back(argument.data());
  values.push_back(nullptr);
  execv(values.front(), values.data());
  std::cerr << "onekvm-netbird-controller: exec " << arguments.front()
            << ": " << std::strerror(errno) << '\n';
  std::_Exit(127);
}

int RunCommandCapture(std::vector<std::string> arguments, std::string &output) {
  int pipe_fds[2];
  if (pipe(pipe_fds) != 0)
    return -1;
  const pid_t child = fork();
  if (child < 0) {
    close(pipe_fds[0]);
    close(pipe_fds[1]);
    return -1;
  }
  if (child == 0) {
    close(pipe_fds[0]);
    (void)dup2(pipe_fds[1], STDOUT_FILENO);
    (void)dup2(pipe_fds[1], STDERR_FILENO);
    close(pipe_fds[1]);
    Exec(std::move(arguments));
  }
  close(pipe_fds[1]);
  output.clear();
  char buffer[4096];
  while (output.size() <= (1U << 20)) {
    const ssize_t count = read(pipe_fds[0], buffer, sizeof(buffer));
    if (count > 0) {
      output.append(buffer, static_cast<std::size_t>(count));
      continue;
    }
    if (count < 0 && errno == EINTR)
      continue;
    break;
  }
  close(pipe_fds[0]);
  int status = 0;
  while (waitpid(child, &status, 0) < 0) {
    if (errno != EINTR)
      return -1;
  }
  if (output.size() > (1U << 20))
    return -1;
  return WIFEXITED(status) ? WEXITSTATUS(status) : -1;
}

int RunCommandAndLinger(std::vector<std::string> arguments,
                        std::string &error) {
  const pid_t child = fork();
  if (child < 0) {
    error = "start OAuth command: " + std::string(std::strerror(errno));
    return 1;
  }
  if (child == 0)
    Exec(std::move(arguments));
  int status = 0;
  while (waitpid(child, &status, 0) < 0) {
    if (errno != EINTR) {
      error = "wait for OAuth command: " + std::string(std::strerror(errno));
      return 1;
    }
  }
  const int result = WIFEXITED(status) ? WEXITSTATUS(status) : 1;
  if (result != 0)
    error = "NetBird browser login failed";
  return result;
}

bool SetStateDirectory(std::string &error) {
  const std::string data = DataPath();
  std::error_code filesystem_error;
  std::filesystem::create_directories(data, filesystem_error);
  if (filesystem_error) {
    error = "create NetBird state directory: " + filesystem_error.message();
    return false;
  }
  if (setenv("NB_STATE_DIR", data.c_str(), 1) != 0) {
    error = "set NB_STATE_DIR: " + std::string(std::strerror(errno));
    return false;
  }
  if (setenv("XDG_CONFIG_HOME", data.c_str(), 1) != 0) {
    error = "set XDG_CONFIG_HOME: " + std::string(std::strerror(errno));
    return false;
  }
  return true;
}

std::vector<std::string> CLI() {
  const std::string data = DataPath();
  return {Executable("netbird"),
          "--config=" + data + "/default.json",
          "--daemon-addr=unix://" + SocketPath() + "/netbird.sock",
          "--log-file=" + data + "/client.log"};
}

void AddConnectionArguments(std::vector<std::string> &arguments,
                            const Settings &settings) {
  arguments.push_back("--disable-dns=true");
  arguments.push_back("--network-monitor=false");
  if (!settings.hostname.empty())
    arguments.push_back("--hostname=" + settings.hostname);
  if (!settings.management_url.empty())
    arguments.push_back("--management-url=" + settings.management_url);
  if (settings.wireguard_port != 0)
    arguments.push_back("--wireguard-port=" +
                        std::to_string(settings.wireguard_port));
}

bool WaitForSocket(std::string &error) {
  return events::WaitForSocket(SocketPath() + "/netbird.sock", error);
}

std::string ObjectString(json_object *object, const char *name) {
  json_object *value = nullptr;
  if (object != nullptr && json_object_object_get_ex(object, name, &value) &&
      json_object_is_type(value, json_type_string))
    return json_object_get_string(value);
  return {};
}

json_object *ObjectValue(json_object *object, const char *name) {
  json_object *value = nullptr;
  if (object != nullptr && json_object_object_get_ex(object, name, &value) &&
      json_object_is_type(value, json_type_object))
    return value;
  return nullptr;
}

std::string ObjectStringEither(json_object *object, const char *first,
                               const char *second) {
  std::string value = ObjectString(object, first);
  return value.empty() ? ObjectString(object, second) : value;
}

bool ObjectBool(json_object *object, const char *name) {
  json_object *value = nullptr;
  return object != nullptr && json_object_object_get_ex(object, name, &value) &&
         json_object_is_type(value, json_type_boolean) &&
         json_object_get_boolean(value) != 0;
}

bool WriteAll(int fd, std::string_view value) {
  while (!value.empty()) {
    const ssize_t count = send(fd, value.data(), value.size(), MSG_NOSIGNAL);
    if (count < 0 && errno == EINTR)
      continue;
    if (count <= 0)
      return false;
    value.remove_prefix(static_cast<std::size_t>(count));
  }
  return true;
}

// Query the daemon's built-in grpc-gateway directly over its private Unix
// socket. Spawning `netbird status` for every UI refresh is expensive on small
// devices and, when the daemon is busy authenticating, can leave multiple CLI
// processes waiting on the same gRPC request.
json_object *ReadDaemonStatus(std::string &error) {
  const std::string socket_path = SocketPath() + "/netbird-http.sock";
  if (!std::filesystem::exists(socket_path))
    return nullptr;
  sockaddr_un address{};
  if (socket_path.size() >= sizeof(address.sun_path)) {
    error = "NetBird JSON socket path is too long";
    return nullptr;
  }
  const int fd = socket(AF_UNIX, SOCK_STREAM | SOCK_CLOEXEC, 0);
  if (fd < 0) {
    error = "open NetBird JSON socket: " + std::string(std::strerror(errno));
    return nullptr;
  }
  timeval timeout{.tv_sec = 2, .tv_usec = 0};
  (void)setsockopt(fd, SOL_SOCKET, SO_RCVTIMEO, &timeout, sizeof(timeout));
  (void)setsockopt(fd, SOL_SOCKET, SO_SNDTIMEO, &timeout, sizeof(timeout));
  address.sun_family = AF_UNIX;
  std::memcpy(address.sun_path, socket_path.c_str(), socket_path.size() + 1);
  if (connect(fd, reinterpret_cast<sockaddr *>(&address), sizeof(address)) !=
      0) {
    error = "connect NetBird JSON socket: " +
            std::string(std::strerror(errno));
    close(fd);
    return nullptr;
  }
  constexpr std::string_view body =
      R"({"getFullPeerStatus":true,"shouldRunProbes":false})";
  const std::string request =
      "POST /daemon.DaemonService/Status HTTP/1.0\r\n"
      "Host: localhost\r\nContent-Type: application/json\r\n"
      "Connection: close\r\nContent-Length: " +
      std::to_string(body.size()) + "\r\n\r\n" + std::string(body);
  if (!WriteAll(fd, request)) {
    error = "write NetBird JSON status request: " +
            std::string(std::strerror(errno));
    close(fd);
    return nullptr;
  }
  std::string response;
  char buffer[4096];
  while (response.size() <= (1U << 20)) {
    const ssize_t count = recv(fd, buffer, sizeof(buffer), 0);
    if (count > 0) {
      response.append(buffer, static_cast<std::size_t>(count));
      continue;
    }
    if (count < 0 && errno == EINTR)
      continue;
    if (count < 0)
      error = "read NetBird JSON status response: " +
              std::string(std::strerror(errno));
    break;
  }
  close(fd);
  if (!error.empty())
    return nullptr;
  if (response.size() > (1U << 20)) {
    error = "NetBird JSON status response exceeds 1 MiB";
    return nullptr;
  }
  const std::size_t header_end = response.find("\r\n\r\n");
  if (header_end == std::string::npos ||
      (response.rfind("HTTP/1.0 200", 0) != 0 &&
       response.rfind("HTTP/1.1 200", 0) != 0)) {
    error = "NetBird JSON status request failed";
    return nullptr;
  }
  std::string parse_error;
  json_object *status = ParseJSON(
      std::string_view(response).substr(header_end + 4), parse_error);
  if (status == nullptr || !json_object_is_type(status, json_type_object)) {
    if (status != nullptr)
      json_object_put(status);
    error = "parse NetBird JSON status response: " + parse_error;
    return nullptr;
  }
  return status;
}

std::string OAuthOutputURL() {
  std::string output;
  std::string ignored;
  if (!ReadFile(DataPath() + "/oauth-output", true, output, ignored))
    return {};
  const std::string_view marker = "Use this URL to log in:";
  const std::size_t marker_position = output.rfind(marker);
  if (marker_position == std::string::npos)
    return {};
  std::size_t begin = output.find("http", marker_position + marker.size());
  if (begin == std::string::npos)
    return {};
  std::size_t end = begin;
  while (end < output.size() &&
         !std::isspace(static_cast<unsigned char>(output[end])))
    ++end;
  std::string url = output.substr(begin, end - begin);
  if (url.rfind("https://", 0) != 0 && url.rfind("http://", 0) != 0)
    url.clear();
  return url;
}

std::string OAuthOutputCode() {
  std::string output, ignored;
  if (!ReadFile(DataPath() + "/oauth-output", true, output, ignored)) return {};
  constexpr std::string_view marker = "and enter the code ";
  const auto position = output.rfind(marker);
  const auto login = output.rfind("Use this URL to log in:");
  if (position == std::string::npos || login == std::string::npos || position < login) return {};
  const auto begin = position + marker.size();
  auto end = begin;
  while (end < output.size() && !std::isspace(static_cast<unsigned char>(output[end]))) ++end;
  if (end - begin > 64) return {};
  return output.substr(begin, end - begin);
}

void PrintJSON(json_object *response) {
  std::cout << json_object_to_json_string_ext(response, JSON_C_TO_STRING_PLAIN)
            << '\n';
  json_object_put(response);
}

void PrintStatus() {
  std::string state_error;
  const bool state_ready = SetStateDirectory(state_error);
  json_object *status = state_ready ? ReadDaemonStatus(state_error) : nullptr;
  json_object *response = json_object_new_object();
  json_object_object_add(response, "online",
                         json_object_new_boolean(status != nullptr));
  const std::string daemon_status = ObjectString(status, "status");
  json_object_object_add(
      response, "daemonStatus",
      json_object_new_string(daemon_status.empty() ? "Offline"
                                                   : daemon_status.c_str()));
  json_object *full_status = ObjectValue(status, "fullStatus");
  json_object *local = ObjectValue(full_status, "localPeerState");
  const std::string ipv4 = ObjectStringEither(local, "IP", "ip");
  const std::string ipv6 = ObjectString(local, "ipv6");
  const std::string fqdn = ObjectString(local, "fqdn");
  json_object_object_add(response, "netbirdIp", json_object_new_string(ipv4.c_str()));
  json_object_object_add(response, "netbirdIpv6", json_object_new_string(ipv6.c_str()));
  json_object_object_add(response, "fqdn", json_object_new_string(fqdn.c_str()));
  std::string management_url;
  bool management_connected = false;
  json_object *management = ObjectValue(full_status, "managementState");
  management_url = ObjectStringEither(management, "URL", "url");
  management_connected = ObjectBool(management, "connected");
  json_object_object_add(response, "managementURL",
                         json_object_new_string(management_url.c_str()));
  json_object_object_add(response, "managementConnected",
                         json_object_new_boolean(management_connected));
  const auto authorization = ReadAuthorization(daemon_status == "Connected");
  json_object_object_add(response, "authWindowSeconds", json_object_new_int(events::AuthWindowSeconds));
  json_object_object_add(response, "authExpiresAt", json_object_new_int64(authorization.expires_at));
  const std::string &auth_url = authorization.url;
  json_object_object_add(response, "authURL",
                         json_object_new_string(auth_url.c_str()));
  json_object_object_add(response, "authState",
                         json_object_new_string(authorization.state.c_str()));
  const std::string auth_code = authorization.state == "pending" ? OAuthOutputCode() : "";
  json_object_object_add(response, "authCode", json_object_new_string(auth_code.c_str()));
  if (status != nullptr)
    json_object_put(status);
  PrintJSON(response);
}

bool WriteSecret(const std::string &path, const std::string &secret,
                 std::string &error) {
  const int fd = open(path.c_str(), O_WRONLY | O_CREAT | O_TRUNC | O_CLOEXEC,
                      0600);
  if (fd < 0) {
    error = "open setup-key file: " + std::string(std::strerror(errno));
    return false;
  }
  std::string_view remaining(secret);
  while (!remaining.empty()) {
    const ssize_t written = write(fd, remaining.data(), remaining.size());
    if (written < 0 && errno == EINTR)
      continue;
    if (written <= 0) {
      error = "write setup-key file: " + std::string(std::strerror(errno));
      close(fd);
      return false;
    }
    remaining.remove_prefix(static_cast<std::size_t>(written));
  }
  if (close(fd) != 0) {
    error = "close setup-key file: " + std::string(std::strerror(errno));
    return false;
  }
  return true;
}

int Run(std::string &error);
int Apply(std::string &error);
int RunOAuth(std::string &error);

std::string OAuthWantedPath() { return DataPath() + "/oauth-wanted"; }

std::string ReadOAuthWanted() {
  std::string data;
  std::string ignored;
  if (!ReadFile(OAuthWantedPath(), true, data, ignored))
    return {};
  while (!data.empty() &&
         std::isspace(static_cast<unsigned char>(data.back())))
    data.pop_back();
  return data;
}

void WriteOAuthState(const std::string &token, const std::string &state,
                     std::int64_t expires_at, std::string_view deadline_url) {
  const std::string path = DataPath() + "/oauth-state";
  const std::string temp = path + "." + std::to_string(getpid());
  {
    std::ofstream output(temp, std::ios::trunc);
    output << token << '\n' << state << '\n' << expires_at << '\n' << deadline_url << '\n';
    if (!output) return;
  }
  (void)chmod(temp.c_str(), 0600);
  (void)rename(temp.c_str(), path.c_str());
}

AuthorizationState ReadAuthorization(bool connected) {
  if (connected) return {"idle", ""};
  const std::string token = ReadOAuthWanted();
  if (token.empty()) return {"idle", ""};
  std::ifstream input(DataPath() + "/oauth-state");
  std::string owner, state;
  std::getline(input, owner);
  std::getline(input, state);
  if (owner != token) return {"starting", ""};
  if (state == "starting") {
    const std::string url = OAuthOutputURL();
    std::string expiry, deadline_url;
    std::getline(input, expiry);
    std::getline(input, deadline_url);
    char *end = nullptr;
    const auto parsed = std::strtoll(expiry.c_str(), &end, 10);
    const std::int64_t expires_at = !expiry.empty() && end && *end == '\0' && parsed > 0 && deadline_url == url ? parsed : 0;
    return url.empty() ? AuthorizationState{"starting", ""} : AuthorizationState{"pending", url, expires_at};
  }
  if (state == "connecting" || state == "failed" || state == "expired" || state == "timed-out") return {state, ""};
  return {"idle", ""};
}

std::string OAuthFailure() {
  std::string output, ignored;
  ReadFile(DataPath() + "/oauth-output", true, output, ignored);
  for (char &ch : output) ch = static_cast<char>(std::tolower(static_cast<unsigned char>(ch)));
  // WaitSSOLogin's deadline comes from the IdP device-code window, not a
  // controller timer. Other RPC/network deadlines do not prove code expiry.
  if (output.find("waiting sso login failed with:") != std::string::npos &&
      output.find("context deadline exceeded") != std::string::npos) return "expired";
  if (output.find("expired_token") != std::string::npos ||
      output.find("code expired") != std::string::npos ||
      output.find("code has expired") != std::string::npos ||
      output.find("link expired") != std::string::npos ||
      output.find("authorization expired") != std::string::npos) return "expired";
  if (output.find("deadline exceeded") != std::string::npos ||
      output.find("timed out") != std::string::npos ||
      output.find("timeout waiting for tailscale service") != std::string::npos) return "timed-out";
  return "failed";
}

void NotifyScreen() {
  std::string ignored;
  RunCommandCapture({EnvironmentPath("ONEKVM_SCREEN_NOTIFY", "/usr/bin/busctl"),
    "--system", "--auto-start=no", "--timeout=1", "call", "org.onekvm.ScreenDisplay",
    "/org/onekvm/ScreenDisplay", "org.onekvm.ScreenDisplay", "Refresh"}, ignored);
}

void RemoveOAuthOutput() {
  std::error_code ignored;
  std::filesystem::remove(DataPath() + "/oauth-output", ignored);
}

void RemoveOAuthWanted() {
  std::error_code ignored;
  std::filesystem::remove(OAuthWantedPath(), ignored);
  RemoveOAuthOutput();
}

int WaitPid(pid_t pid) {
  int status = 0;
  while (waitpid(pid, &status, 0) < 0) {
    if (errno != EINTR)
      return -1;
  }
  return WIFEXITED(status) ? WEXITSTATUS(status) : -1;
}

pid_t Spawn(int (*fn)(std::string &), std::string &error) {
  const pid_t pid = fork();
  if (pid < 0) {
    error = std::string("fork: ") + std::strerror(errno);
    return -1;
  }
  if (pid == 0) {
    events::ChildSignals();
    (void)setpgid(0, 0);
    std::string child_error;
    const int result = fn(child_error);
    if (result != 0 && !child_error.empty())
      std::cerr << "onekvm-netbird-controller: " << child_error << '\n';
    std::_Exit(result == 0 ? 0 : 1);
  }
  (void)setpgid(pid, pid);
  return pid;
}

int Connect(std::string &error) {
  if (!RuntimeReady(error)) return 1;
  if (!SetStateDirectory(error))
    return 1;
  events::AuthorizationLock lock(DataPath());
  if (lock.fd < 0) { error = "lock authorization request"; return 1; }
  const auto authorization = ReadAuthorization(false);
  if (authorization.state == "starting" || authorization.state == "pending" || authorization.state == "connecting") {
    json_object *response = json_object_new_object();
    json_object_object_add(response, "started", json_object_new_boolean(0));
    json_object_object_add(response, "alreadyPending", json_object_new_boolean(1));
    PrintJSON(response);
    return 0;
  }
  const std::string pending = OAuthWantedPath() + "." + std::to_string(getpid());
  std::ofstream output(pending, std::ios::trunc);
  if (!output) {
    error = "write oauth request";
    return 1;
  }
  output << std::chrono::steady_clock::now().time_since_epoch().count() << '\n';
  output.close();
  if (!output || rename(pending.c_str(), OAuthWantedPath().c_str()) != 0) {
    error = "publish oauth request";
    return 1;
  }
  json_object *response = json_object_new_object();
  json_object_object_add(response, "started", json_object_new_boolean(1));
  PrintJSON(response);
  return 0;
}

int RunNamed(std::string_view command, const char *key, bool value,
             std::string &error) {
  events::AuthorizationLock lock(DataPath());
  if (lock.fd < 0) { error = "lock authorization request"; return 1; }
  RemoveOAuthWanted();
  if (!SetStateDirectory(error) || !WaitForSocket(error))
    return 1;
  std::vector<std::string> arguments = CLI();
  arguments.push_back(std::string(command));
  std::string output;
  const int result = RunCommandCapture(std::move(arguments), output);
  if (result != 0) {
    error = output.empty() ? "netbird " + std::string(command) + " failed"
                           : output;
    return 1;
  }
  json_object *response = json_object_new_object();
  json_object_object_add(response, key, json_object_new_boolean(value));
  PrintJSON(response);
  return 0;
}

void StopChild(pid_t &pid) {
  if (pid > 0) {
    (void)kill(-pid, SIGTERM);
    (void)WaitPid(pid);
    pid = -1;
  }
}

int Service(std::string &error) {
  if (!RuntimeReady(error)) return 78; // EX_CONFIG: repair missing packages.
  events::Watch watch(DataPath(), SocketPath());
  events::AuthorizationDeadline deadline;
  if (!watch.valid() || deadline.fd < 0) { error = "create service event subscriptions"; return 1; }
  std::string oauth_token;
  {
    events::AuthorizationLock lock(DataPath());
    if (lock.fd < 0) { error = "lock authorization recovery"; return 1; }
    oauth_token = ReadOAuthWanted();
    const auto previous = ReadAuthorization(false);
    // A new supervisor cannot resume an old login process or its monotonic
    // deadline. Retire interrupted requests; never replay terminal requests.
    if (previous.state == "starting" || previous.state == "pending" || previous.state == "connecting")
      WriteOAuthState(oauth_token, "failed");
    RemoveOAuthOutput();
  }
  pid_t daemon = Spawn(Run, error);
  if (daemon < 0) return 1;
  pid_t apply = Spawn(Apply, error);
  pid_t oauth = -1;
  std::string authorization_url;
  events::Stream stream;
  for (;;) {
    const std::string wanted = ReadOAuthWanted();
    if (wanted != oauth_token) {
      deadline.clear();
      authorization_url.clear();
      StopChild(oauth);
      RemoveOAuthOutput();
      oauth_token = wanted;
      if (!wanted.empty()) {
        WriteOAuthState(wanted, "starting");
        oauth = Spawn(RunOAuth, error);
        if (oauth < 0) WriteOAuthState(wanted, "failed");
      }
      NotifyScreen();
    }
    stream.open(SocketPath() + "/netbird-http.sock", "POST /daemon.DaemonService/SubscribeStatus HTTP/1.0\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: 50\r\n\r\n{\"getFullPeerStatus\":true,\"shouldRunProbes\":false}");
    pollfd fds[] = {{watch.files, POLLIN, 0}, {watch.signals, POLLIN, 0}, {stream.fd, POLLIN, 0}, {deadline.fd, POLLIN, 0}};
    if (poll(fds, 4, stream.timeout()) < 0) {
      if (errno == EINTR) continue;
      error = "wait for service events";
      StopChild(oauth); StopChild(apply); StopChild(daemon);
      return 1;
    }
    bool changed = watch.drainFiles();
    if (watch.stopping()) {
      StopChild(oauth); StopChild(apply); StopChild(daemon);
      RemoveOAuthOutput();
      return 0;
    }
    int status = 0;
    for (pid_t ended; (ended = waitpid(-1, &status, WNOHANG)) > 0;) {
      if (ended == daemon) {
        daemon = -1;
        StopChild(oauth); StopChild(apply);
        error = "daemon exited";
        return WIFEXITED(status) && WEXITSTATUS(status) == 0 ? 0 : 1;
      }
      if (ended == apply) apply = -1;
      if (ended == oauth) {
        oauth = -1;
        const auto auth = ReadAuthorization(false);
        if (auth.state == "starting" || auth.state == "pending") WriteOAuthState(oauth_token, "failed");
        RemoveOAuthOutput();
        changed = true;
      }
    }
    if (fds[2].revents) changed = stream.read() || changed;
    // Bind the one-shot window to the current request and URL, never to an App view.
    const auto auth = ReadAuthorization(false);
    if (oauth > 0 && !oauth_token.empty() && ReadOAuthWanted() == oauth_token && auth.state == "pending") {
      if (authorization_url != auth.url) {
        authorization_url = auth.url;
        if (!deadline.arm()) {
          error = "arm authorization expiry event";
          StopChild(oauth); StopChild(apply); StopChild(daemon);
          RemoveOAuthOutput();
          return 1;
        }
        WriteOAuthState(oauth_token, "starting", events::AuthorizationDeadline::expiresAt(), authorization_url);
        changed = true;
      }
      if (deadline.expired()) {
        StopChild(oauth);
        WriteOAuthState(oauth_token, "expired");
        RemoveOAuthOutput();
        deadline.clear();
        authorization_url.clear();
        changed = true;
      }
    } else if (!authorization_url.empty()) {
      deadline.clear();
      authorization_url.clear();
    }
    if (changed) NotifyScreen();
  }
}

int Run(std::string &error) {
  if (!SetStateDirectory(error))
    return 1;
  std::error_code filesystem_error;
  std::filesystem::create_directories(SocketPath(), filesystem_error);
  if (filesystem_error) {
    error = "create NetBird socket directory: " + filesystem_error.message();
    return 1;
  }
  std::vector<std::string> arguments = CLI();
  arguments[3] = "--log-file=console";
  arguments.insert(arguments.end(),
                   {"service", "run", "--enable-json-socket",
                    "--json-socket=unix://" + SocketPath() +
                        "/netbird-http.sock"});
  Exec(std::move(arguments));
}

int Apply(std::string &error) {
  Settings settings;
  if (!LoadSettings(false, settings, error) || !SetStateDirectory(error))
    return 1;
  if (settings.setup_key.empty())
    return 0;
  if (!WaitForSocket(error))
    return 1;
  const std::string secret_path = DataPath() + "/setup-key";
  if (!WriteSecret(secret_path, settings.setup_key, error))
    return 1;
  std::vector<std::string> arguments = CLI();
  arguments.push_back("up");
  AddConnectionArguments(arguments, settings);
  arguments.push_back("--setup-key-file=" + secret_path);
  Exec(std::move(arguments));
}

int RunOAuth(std::string &error) {
  const std::string token = ReadOAuthWanted();
  WriteOAuthState(token, "starting");
  Settings settings;
  if (!LoadSettings(false, settings, error) || !SetStateDirectory(error) ||
      !WaitForSocket(error))
    return 1;
  const int output_fd =
      open((DataPath() + "/oauth-output").c_str(),
           O_WRONLY | O_CREAT | O_TRUNC | O_CLOEXEC, 0600);
  if (output_fd < 0) {
    error = "open OAuth output: " + std::string(std::strerror(errno));
    return 1;
  }
  if (dup2(output_fd, STDOUT_FILENO) < 0 ||
      dup2(output_fd, STDERR_FILENO) < 0) {
    error = "redirect OAuth output: " + std::string(std::strerror(errno));
    close(output_fd);
    return 1;
  }
  close(output_fd);
  std::vector<std::string> arguments = CLI();
  arguments.insert(arguments.end(), {"login", "--no-browser"});
  if (!settings.hostname.empty())
    arguments.push_back("--hostname=" + settings.hostname);
  if (!settings.management_url.empty())
    arguments.push_back("--management-url=" + settings.management_url);
  if (RunCommandAndLinger(std::move(arguments), error) != 0) {
    WriteOAuthState(token, OAuthFailure());
    RemoveOAuthOutput();
    return 1;
  }
  WriteOAuthState(token, "connecting");
  RemoveOAuthOutput();

  // Login only enrolls the peer. Bring the tunnel up after authentication has
  // completed so the daemon never receives an empty setup key as an `up`
  // authentication method.
  arguments = CLI();
  arguments.push_back("up");
  AddConnectionArguments(arguments, settings);
  const int result = RunCommandAndLinger(std::move(arguments), error);
  WriteOAuthState(token, result == 0 ? "idle" : "failed");
  return result;
}

} // namespace

int main(int argc, char **argv) {
  std::string error;
  int result = 1;
  const std::string_view command = argc >= 2 ? argv[1] : "--service";
  if (argc > 2) {
    error = "usage: onekvm-netbird-controller "
            "[--service|status|connect|disconnect|logout|--health|--run|--apply|--oauth]";
  } else if (command == "--service") {
    result = Service(error);
  } else if (command == "status") {
    PrintStatus();
    result = 0;
  } else if (command == "connect") {
    result = Connect(error);
  } else if (command == "disconnect") {
    result = RunNamed("down", "connected", false, error);
  } else if (command == "logout") {
    result = RunNamed("deregister", "loggedOut", true, error);
  } else if (command == "--health") {
    Settings settings;
    result = LoadSettings(true, settings, error) && RuntimeReady(error) ? 0 : 1;
  } else if (command == "--run") {
    result = Run(error);
  } else if (command == "--apply") {
    result = Apply(error);
  } else if (command == "--oauth") {
    result = RunOAuth(error);
  } else {
    error = "usage: onekvm-netbird-controller "
            "[--service|status|connect|disconnect|logout|--health|--run|--apply|--oauth]";
  }
  if (result != 0)
    std::cerr << "onekvm-netbird-controller: " << error << '\n';
  return result;
}
