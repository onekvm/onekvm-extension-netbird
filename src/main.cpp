#include <json-c/json.h>

#include <fcntl.h>
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

constexpr std::string_view kExtensionID = "netbird";

struct Settings {
  std::string setup_key;
  std::string hostname = "onekvm";
  std::string management_url;
  int wireguard_port = 51820;
};

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
  std::vector<char> buffer(4096);
  const ssize_t length = readlink("/proc/self/exe", buffer.data(),
                                  buffer.size() - 1);
  if (length <= 0)
    return "bin/" + std::string(name);
  buffer[static_cast<std::size_t>(length)] = '\0';
  std::filesystem::path path(buffer.data());
  return (path.parent_path() / name).string();
}

[[noreturn]] void Exec(std::vector<std::string> arguments) {
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
  if (result == 0)
    std::this_thread::sleep_for(std::chrono::seconds(1));
  else
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
  const std::string socket = SocketPath() + "/netbird.sock";
  for (int attempt = 0; attempt < 100 && !std::filesystem::exists(socket);
       ++attempt)
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
  if (std::filesystem::exists(socket))
    return true;
  error = "NetBird daemon socket did not become ready";
  return false;
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

void PrintPlan(json_object *response) {
  json_object *plan = json_object_new_object();
  json_object_object_add(plan, "actions", json_object_new_array());
  json_object_object_add(plan, "response", response);
  std::cout << json_object_to_json_string_ext(plan, JSON_C_TO_STRING_PLAIN);
  json_object_put(plan);
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
  const std::string auth_url =
      daemon_status == "Connected" ? std::string() : OAuthOutputURL();
  json_object_object_add(response, "authURL",
                         json_object_new_string(auth_url.c_str()));
  if (status != nullptr)
    json_object_put(status);
  PrintPlan(response);
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

bool Controller(std::string &error) {
  std::string input((std::istreambuf_iterator<char>(std::cin)),
                    std::istreambuf_iterator<char>());
  json_object *root = ParseJSON(input, error);
  if (root == nullptr || !json_object_is_type(root, json_type_object)) {
    if (root != nullptr)
      json_object_put(root);
    return false;
  }
  json_object *event_value = nullptr;
  json_object *id_value = nullptr;
  json_object *enabled_value = nullptr;
  const bool valid =
      json_object_object_get_ex(root, "event", &event_value) &&
      json_object_is_type(event_value, json_type_string) &&
      json_object_object_get_ex(root, "extension_id", &id_value) &&
      json_object_is_type(id_value, json_type_string) &&
      json_object_object_get_ex(root, "enabled", &enabled_value) &&
      json_object_is_type(enabled_value, json_type_boolean);
  if (!valid || std::string_view(json_object_get_string(id_value)) !=
                    kExtensionID) {
    json_object_put(root);
    error = "unsupported controller event";
    return false;
  }
  const std::string event = json_object_get_string(event_value);
  const bool enabled = json_object_get_boolean(enabled_value) != 0;
  if (event == "invoke") {
    json_object *method_value = nullptr;
    const bool method_valid =
        json_object_object_get_ex(root, "method", &method_value) &&
        json_object_is_type(method_value, json_type_string);
    const std::string method =
        method_valid ? json_object_get_string(method_value) : "";
    json_object_put(root);
    if (method == "status") {
      PrintStatus();
      return true;
    }
    if (method == "connect") {
      std::cout << R"({"actions":[{"type":"remove","name":"oauth"},{"type":"ensure","name":"oauth","command":["bin/onekvm-netbird-controller","--oauth"],"restart":"no"}],"response":{"started":true}})";
      return true;
    }
    if (method == "disconnect") {
      std::cout << R"({"actions":[{"type":"remove","name":"oauth"},{"type":"exec","name":"disconnect","command":["bin/onekvm-netbird-controller","--disconnect"],"timeout_seconds":25}],"response":{"connected":false}})";
      return true;
    }
    if (method == "logout") {
      std::cout << R"({"actions":[{"type":"remove","name":"oauth"},{"type":"exec","name":"logout","command":["bin/onekvm-netbird-controller","--logout"],"timeout_seconds":20}],"response":{"loggedOut":true}})";
      return true;
    }
    error = "unknown public method " + method;
    return false;
  }
  json_object_put(root);
  if (event != "enable" && event != "disable" && event != "reconcile" &&
      event != "config_changed") {
    error = "unsupported controller lifecycle event " + event;
    return false;
  }
  if (!enabled || event == "disable") {
    std::cout << R"({"actions":[{"type":"remove_all"}]})";
  } else if (event == "config_changed") {
    std::cout << R"({"actions":[{"type":"remove_all"},{"type":"ensure","name":"netbird","command":["bin/onekvm-netbird-controller","--run"],"restart":"on-failure"},{"type":"exec","name":"apply","command":["bin/onekvm-netbird-controller","--apply"],"timeout_seconds":30}]})";
  } else {
    std::cout << R"({"actions":[{"type":"ensure","name":"netbird","command":["bin/onekvm-netbird-controller","--run"],"restart":"on-failure"},{"type":"exec","name":"apply","command":["bin/onekvm-netbird-controller","--apply"],"timeout_seconds":30}]})";
  }
  return true;
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
  if (RunCommandAndLinger(std::move(arguments), error) != 0)
    return 1;

  // Login only enrolls the peer. Bring the tunnel up after authentication has
  // completed so the daemon never receives an empty setup key as an `up`
  // authentication method.
  arguments = CLI();
  arguments.push_back("up");
  AddConnectionArguments(arguments, settings);
  return RunCommandAndLinger(std::move(arguments), error);
}

int RunControl(std::string_view command, std::string &error) {
  if (!SetStateDirectory(error) || !WaitForSocket(error))
    return 1;
  std::error_code remove_error;
  std::filesystem::remove(DataPath() + "/oauth-output", remove_error);
  std::vector<std::string> arguments = CLI();
  arguments.push_back(std::string(command));
  Exec(std::move(arguments));
}

} // namespace

int main(int argc, char **argv) {
  std::string error;
  int result = 1;
  if (argc == 2 && std::string_view(argv[1]) == "--controller") {
    result = Controller(error) ? 0 : 1;
  } else if (argc == 2 && std::string_view(argv[1]) == "--health") {
    Settings settings;
    result = LoadSettings(true, settings, error) ? 0 : 1;
  } else if (argc == 2 && std::string_view(argv[1]) == "--run") {
    result = Run(error);
  } else if (argc == 2 && std::string_view(argv[1]) == "--apply") {
    result = Apply(error);
  } else if (argc == 2 && std::string_view(argv[1]) == "--oauth") {
    result = RunOAuth(error);
  } else if (argc == 2 && std::string_view(argv[1]) == "--disconnect") {
    result = RunControl("down", error);
  } else if (argc == 2 && std::string_view(argv[1]) == "--logout") {
    result = RunControl("deregister", error);
  } else {
    error = "usage: onekvm-netbird-controller "
            "[--controller|--health|--run|--apply|--oauth|--disconnect|--logout]";
  }
  if (result != 0)
    std::cerr << "onekvm-netbird-controller: " << error << '\n';
  return result;
}
