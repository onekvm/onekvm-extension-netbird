import { ExtensionApp } from "@onekvm/screen-ui";
import { CONFIG } from "./config";
import { statusLabel, summary } from "./status";

export default function App() {
  return <ExtensionApp config={CONFIG} statusLabel={statusLabel} summary={summary} />;
}
