import type { AppConfig } from "@onekvm/screen-ui";

export const CONFIG: AppConfig = {
  "extension": "netbird",
  "title": "NetBird",
  "glyph": "N",
  "statusMethod": "status",
  "kind": "network",
  "actions": [
    {
      "method": "connect",
      "title": "Connect"
    },
    {
      "method": "disconnect",
      "title": "Disconnect"
    }
  ]
};
