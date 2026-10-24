# Screen App

The App's editable source lives in `src/`:

- `main.tsx` mounts the App; `App.tsx` composes the shared service screen.
- `config.ts` declares extension identity, actions and business validation.
- `status.ts` formats this extension's status for display.

Rotary/touch input, theme and font slots, status cards, action buttons, event-driven RPC
state and common translations come from `@onekvm/screen-ui`, maintained in
`onekvm-screen-display/packages/screen-ui`. Change shared behavior there;
do not copy it into this extension.

Build with Bun, PocketJS, the screen UI source SDK and Noto Sans CJK fonts.
Run `bun install --frozen-lockfile` in the PocketJS checkout first:

```sh
make -C screen-app POCKETJS=/path/to/pocketjs \
  SCREEN_UI=/path/to/onekvm-screen-display/packages/screen-ui \
  FONT_REG=/path/to/NotoSansCJKsc-Regular.otf \
  FONT_BOLD=/path/to/NotoSansCJKsc-Bold.otf
```

The default paths use sibling workspace checkouts. The shared build helper
stages dependencies in a temporary directory and writes only runtime output
to ignored `dist/main.vue-vapor.js` and `dist/main.vue-vapor.pak`.
`onekvm-distro` supplies fixed SDK source via `onekvm-screen-ui-native` and
builds the App before packaging it. IPKs contain the compiled JS and font
resources; source modules and build dependencies stay off the device.

`src/logo.png` is the 64×64 launcher/header asset, derived from the same
artwork as the Web manifest (Lucide Radio for Wake on LAN). The shared build
writes `icon.bin` from these pixels. Install it beside JS/PAK and declare
`icon: "icon.bin"` in the screen contribution.

Browser enrollment uses the current device authorization URL, displayed as
a QR code with a four-module quiet zone. The controller publishes `authState`
and clears retired URLs. Daemon subscriptions and file events call the screen
D-Bus `Refresh` method; waiting for approval does not poll. This App requires
the screen host's `state-events` and `qr-code` features.

Authorization lifetime follows the active CLI session. NetBird's SSO wait uses
the IdP-provided device-code expiry; a completed, expired, cancelled or replaced
session retires both its URL and manual code. RPC/network timeouts are reported
as `timed-out`, not as proof that a device code expired.

See [authorization lifetime and upstream sources](../docs/authorization-lifetime.md)
for the IdP-provided lifetime, embedded Dex defaults and protocol boundaries.
The visible Back button leaves the App without cancelling the current login;
it is also part of the rotary selection cycle and remains available while busy.

OneKVM additionally enforces a 300-second local QR/waiting window, starting
when the URL is first available. A one-shot monotonic timer ends the wait and
clears retired credentials. Back/status reads do not renew it; only manual
retry starts another session. This does not change the provider URL lifetime.

返回采用 HDMI 环回的左上角箭头：点击或右滑回 App 列表，长按旋钮回主屏。
生成链接、待扫码或连接中的终止按钮显示“取消”；建立连接后才显示“断开”。
