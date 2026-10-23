# Screen App

The App's editable source lives in `src/`:

- `main.tsx` mounts the App; `App.tsx` composes the shared service screen.
- `config.ts` declares extension identity, actions and business validation.
- `status.ts` formats this extension's status for display.

Rotary/touch input, theme and font slots, status cards, action buttons, RPC
polling and common translations come from `@onekvm/screen-ui`, maintained in
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
