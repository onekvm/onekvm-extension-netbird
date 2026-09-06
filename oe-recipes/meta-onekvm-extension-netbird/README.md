# OpenEmbedded layer

This layer packages the NetBird extension for OneKVM. The integrating distro
must set `ONEKVM_COMPONENT_SRCREV`; the NetBird revision remains independently
pinned. The layer supports `wrynose` and depends on `onekvm`.
