# OneKVM NetBird Extension

English | [简体中文](README.zh-CN.md)

Connect OneKVM to a NetBird network without adding NetBird to the base image.
The extension provides the lifecycle controller, settings page, and an upstream
NetBird client packaged by OpenEmbedded.

> **Build note:** This repository contains extension sources only. Release
> packages are built by the OpenEmbedded recipes in `onekvm-distro`; this
> repository does not provide a standalone release build.

## Features

- Interactive browser sign-in or setup-key enrollment for unattended devices
- Connection state, NetBird IPv4 and IPv6 addresses, FQDN, and management
  server status on the extension page
- Configurable device hostname, management server URL, and WireGuard UDP port
- Disconnect without removing the peer, or log out and remove it completely
- Private client state that is isolated from the base system

## Install and enable

The package name is `onekvm-extension-netbird`. Install it through your OneKVM
distribution package or image, then manage it with the plugin manager:

```sh
onekvm-plugin-manager enable netbird
onekvm-plugin-manager disable netbird
```

The extension requires the `wireguard` and `nf_tables` kernel modules.

## Connect

Open the **NetBird** extension page and choose either method:

- Leave **Setup key** empty, save the settings, select **Connect in browser**,
  then open the generated sign-in link.
- Enter a NetBird setup key for unattended enrollment, save the settings, and
  enable or restart the extension.

The management server URL is optional for NetBird Cloud and can point to a
self-hosted deployment. The default hostname is `onekvm`; the default WireGuard
port is `51820`, while `0` lets the client choose.

## Security and networking

The setup key is a secret setting and is written to a mode `0600` file before
the client reads it. It does not appear in the systemd command line. Client
state and sockets remain under the extension's private directories.

DNS and network-monitor management are disabled so NetBird does not replace
the KVM management resolver configuration. Network access is still governed by
the policies configured in your NetBird account.

## Development

The C++20 controller can be built with CMake. With testing enabled, run the
lifecycle test through CTest:

```sh
cmake -S . -B build -DBUILD_TESTING=ON
cmake --build build
ctest --test-dir build --output-on-failure
```

The upstream NetBird binary is supplied separately by the OpenEmbedded recipe.

## License

This project is licensed under the GNU General Public License v3.0. See
[`LICENSE`](LICENSE). The packaged NetBird client and its dependencies retain
their respective upstream licenses.
