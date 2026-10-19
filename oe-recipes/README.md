# OpenEmbedded layer

This layer packages the NetBird extension for OneKVM. The integrating distro
must set `ONEKVM_COMPONENT_SRCREV`; the NetBird revision remains independently
pinned. The layer supports `wrynose` and depends on `onekvm`.

The upstream client is NetBird 0.81.2. Its release version is embedded in the
binary independently of the extension package version. After changing the
upstream revision, regenerate the checked module and license metadata with
`bitbake -c update_modules onekvm-extension-netbird` before building the IPK.
