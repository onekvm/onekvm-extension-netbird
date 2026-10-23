import type { AppConfig } from "./types";

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
