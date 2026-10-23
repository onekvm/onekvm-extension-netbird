import type { Translator } from "./i18n";
import type { Status } from "./types";

function text(value: unknown, fallback: string): string {
  return typeof value === "string" && value ? value : fallback;
}

export function statusLabel(state: Status, t: Translator): string {
  return t(state.daemonStatus === "Connected" ? "connected" : "disconnected");
}

export function summary(state: Status, t: Translator): string {
  return state.daemonStatus === "Connected" ? text(state.netbirdIp, t("connected")) : t("disconnected");
}
