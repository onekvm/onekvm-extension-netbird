import type { Action, Authorization, MessageKey, Status, Translator } from "@onekvm/screen-ui";

function authorizationActive(state: Status): boolean {
  return ["starting", "pending", "connecting"].includes(String(state.authState)) || state.daemonStatus === "Connecting";
}

export function actionLabel(state: Status, action: Action): MessageKey | undefined {
  return action.method === "disconnect" && state.daemonStatus !== "Connected" && authorizationActive(state) ? "cancel" : undefined;
}

export function actionEnabled(state: Status, action: Action): boolean {
  const active = authorizationActive(state);
  const connected = state.daemonStatus === "Connected";
  if (action.method === "connect") return state.online === true && !active && !connected;
  if (action.method === "disconnect") return state.online === true && (active || connected);
  return true;
}

function text(value: unknown, fallback: string): string {
  return typeof value === "string" && value ? value : fallback;
}

export function statusLabel(state: Status, t: Translator): string {
  return t(state.daemonStatus === "Connected" ? "connected" : "disconnected");
}

export function summary(state: Status, t: Translator): string {
  return state.daemonStatus === "Connected" ? text(state.netbirdIp, t("connected")) : t("disconnected");
}

export function authorization(state: Status): Authorization {
  if (state.daemonStatus === "Connected") return { state: "idle" };
  const phase = state.authState;
  if (phase === "starting" || phase === "connecting" || phase === "expired" || phase === "failed" || phase === "timed-out") return { state: phase };
  if (state.authURL && phase === "pending") {
    const auth: Authorization = { state: "pending", url: String(state.authURL) };
    if (typeof state.authCode === "string" && state.authCode) auth.code = state.authCode;
    return auth;
  }
  return { state: "idle" };
}
