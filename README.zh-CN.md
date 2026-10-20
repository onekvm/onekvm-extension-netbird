# OneKVM NetBird 扩展

[English](README.md) | 简体中文

在不把 NetBird 加入基础镜像的情况下，将 OneKVM 连接到 NetBird 网络。
扩展提供生命周期控制器和设置页面；上游 NetBird 客户端由 OpenEmbedded
随扩展打包。

> **构建说明：** 本仓库只包含扩展源码。正式软件包由 `onekvm-distro` 中的
> OpenEmbedded（OE）配方统一构建；本仓库不提供独立的正式构建流程。

## 功能

- 支持浏览器交互登录，也支持 Setup Key 无人值守注册
- 在扩展页面显示连接状态、NetBird IPv4/IPv6 地址、完整域名和管理服务器状态
- 可配置设备主机名、管理服务器 URL 和 WireGuard UDP 端口
- 可以只断开连接，也可以登出并彻底移除设备
- 客户端状态与基础系统隔离，保存在扩展私有目录中

## 安装与启用

软件包名称是 `onekvm-extension-netbird`。请通过 OneKVM 发行版的软件包或
镜像安装，然后使用插件管理器控制扩展：

```sh
onekvm-extension enable netbird
onekvm-extension disable netbird
```

扩展需要 `wireguard` 和 `nf_tables` 内核模块。

## 连接

打开 **NetBird** 扩展页面并选择一种方式：

- 将 **Setup Key** 留空并保存，点击 **使用浏览器连接**，然后打开生成的
  登录链接。
- 填写用于无人值守注册的 NetBird Setup Key，保存设置后启用或重启扩展。

使用 NetBird Cloud 时可以留空管理服务器 URL；自建服务可在此填写地址。
默认主机名是 `onekvm`，默认 WireGuard 端口是 `51820`；设为 `0` 时由
客户端自行选择。

## 安全与网络

Setup Key 属于敏感设置，控制器会将其写入权限为 `0600` 的文件，再交给
客户端读取，因此不会出现在 systemd 命令行中。客户端状态和 Socket 都
位于扩展私有目录。

扩展会关闭 NetBird 的 DNS 和网络监控管理，避免替换 KVM 管理网络的
解析器配置。实际网络访问仍受 NetBird 账户中配置的策略控制。

## 开发

C++20 控制器可以使用 CMake 构建。启用测试后，通过 CTest 运行生命周期
测试：

```sh
cmake -S . -B build -DBUILD_TESTING=ON
cmake --build build
ctest --test-dir build --output-on-failure
```

上游 NetBird 二进制文件由 OpenEmbedded 配方另行提供。

## 许可证

本项目使用 GNU General Public License v3.0，完整条款见
[`LICENSE`](LICENSE)。随包提供的 NetBird 客户端及其依赖继续使用各自的
上游许可证。
