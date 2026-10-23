# Screen App

The App source lives in `src/`:

- `main.tsx`: mount the App.
- `App.tsx`: compose the screen layout.
- `components/`: status card and action buttons with typed props and callbacks.
- `useExtension.ts`: RPC state, polling and rotary input.
- `status.ts`: extension-specific status presentation.
- `config.ts`: extension identity and permitted actions.
- `locales/` and `i18n.ts`: English, Simplified Chinese and Traditional Chinese.
- `device.ts`, `theme.ts`, `types.ts`: host bridge, presentation constants and types.

Build with Bun, a PocketJS checkout and Noto Sans CJK fonts. Run
`bun install --frozen-lockfile` in the PocketJS checkout first:

```sh
make -C screen-app POCKETJS=/path/to/pocketjs \
  FONT_REG=/path/to/NotoSansCJKsc-Regular.otf \
  FONT_BOLD=/path/to/NotoSansCJKsc-Bold.otf
```

This writes `dist/main.vue-vapor.js` (compiled App) and
`dist/main.vue-vapor.pak` (font atlases and other resources). Both are ignored
by Git. The device loads these two runtime files; it does not compile TSX.
`onekvm-distro` builds them automatically through `onekvm-screen-app.bbclass`
before packaging the extension. IPKs contain the runtime files, not `src/`.
