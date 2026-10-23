import { shallowRef } from "vue";
import { onFrame } from "@pocketjs/framework/vue-vapor/lifecycle";
import { CONFIG } from "./config";
import { device, invoke, setHot } from "./device";
import type { Status } from "./types";

function safeJSON(raw: string): Status {
  try {
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" && !Array.isArray(value) ? value as Status : {};
  } catch { return {}; }
}

export function useExtension() {
  const state = shallowRef<Status>({});
  const busy = shallowRef(false);
  const message = shallowRef<"" | "failed" | "saveDevice">("");
  const selected = shallowRef(0);
  let lastResponse = "";
  let lastPoll = 0;
  let knobSeq = "0";

  function action(index: number) {
    const item = CONFIG.actions[index];
    if (!item || busy.value) return;
    if (CONFIG.kind === "wake" && state.value.configured !== true) {
      message.value = "saveDevice";
      return;
    }
    busy.value = true;
    message.value = "";
    invoke(CONFIG.extension, item.method, item.request || {});
  }

  function press(index: number) {
    selected.value = index;
    action(index);
    setHot(true);
  }

  onFrame(() => {
    const raw = device()?.get?.("appResponse") || "";
    if (raw && raw !== lastResponse) {
      lastResponse = raw;
      const response = safeJSON(raw);
      busy.value = response.busy === true;
      if (response.ok === false) message.value = "failed";
      const payload = response.response;
      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        state.value = payload as Status;
        if (response.ok === true) message.value = "";
      }
    }
    const now = Date.now();
    if (now - lastPoll > 4000) {
      lastPoll = now;
      if (!busy.value) {
        busy.value = true;
        invoke(CONFIG.extension, CONFIG.statusMethod);
      }
    }
    const seq = device()?.get?.("knobSeq") || "0";
    if (seq !== knobSeq) {
      knobSeq = seq;
      const step = Number(device()?.get?.("knob") || "0");
      if (step && CONFIG.actions.length) selected.value = ((selected.value + step) % CONFIG.actions.length + CONFIG.actions.length) % CONFIG.actions.length;
      if (device()?.get?.("knobClick") === "1") action(selected.value);
      if (device()?.get?.("knobHold") === "1") device()?.set?.("launch", "shell");
    }
  });

  return { state, busy, message, selected, press };
}
