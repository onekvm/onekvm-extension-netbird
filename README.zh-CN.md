# OneKVM NetBird 扩展

[English](README.md) | 简体中文

> **构建说明：** 本仓库只包含扩展源码。扩展统一由 `onekvm-distro` 中的
> OpenEmbedded（OE）配方构建和打包；本仓库不提供独立的正式构建流程。

本仓库包含 NetBird 的 OneKVM 生命周期控制器和设置页面。上游客户端及其
Go 依赖不进入 OneKVM 基础镜像，而是由 OpenEmbedded 随扩展提供。

客户端以前台模式运行，状态保存在插件私有目录中；setup key 保存在权限为
0600 的文件中，不会出现在 systemd 命令行。扩展会关闭 DNS 和网络监控
管理，避免替换 KVM 管理网络的解析器配置。
