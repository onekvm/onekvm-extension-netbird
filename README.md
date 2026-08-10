# OneKVM NetBird extension

English | [简体中文](README.zh-CN.md)

> **Build note:** This repository contains extension sources only. The
> extension is built and packaged by the OpenEmbedded recipes in
> `onekvm-distro`; this repository does not provide a standalone release build.

This repository contains the OneKVM lifecycle controller and settings page for
NetBird. The upstream client and its Go dependencies are excluded from the
OneKVM base image and are supplied with the extension by OpenEmbedded.

The client uses foreground mode, a plugin-private state directory, and a
setup-key file with mode 0600. The key never appears in a systemd command
line. DNS and network-monitor management are disabled so the plugin does not
replace the KVM management resolver configuration.
