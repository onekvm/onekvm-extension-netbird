import { shallowRef } from "vue";
import { onFrame } from "@pocketjs/framework/vue-vapor/lifecycle";
import en from "./locales/en";
import zh from "./locales/zh";
import zhTw from "./locales/zh_tw";

export type Lang = "en" | "zh" | "zh_tw";
export type Messages = Record<keyof typeof en, string>;
export type MessageKey = keyof Messages;
export type Translator = (key: MessageKey, values?: Record<string, string | number>) => string;
const packs: Record<Lang, Messages> = { en, zh, zh_tw: zhTw };

export function normalizeLang(raw: string): Lang {
  const lang = raw.trim().toLowerCase().replace(/-/g, "_");
  if (lang === "zh" || lang === "zh_cn") return "zh";
  return lang === "zh_tw" ? "zh_tw" : "en";
}

export function readLang(): Lang {
  const bridge = (globalThis as { onekvm?: { get?(key: string): string } }).onekvm;
  return normalizeLang(bridge?.get?.("language") || "");
}

export function t(key: MessageKey, values: Record<string, string | number> = {}, lang = readLang()): string {
  return packs[lang][key].replace(/\{([^{}]+)\}/g, (placeholder, name: string) => (
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : placeholder
  ));
}

export function useI18n(): Translator {
  const lang = shallowRef(readLang());
  onFrame(() => {
    const next = readLang();
    if (next !== lang.value) lang.value = next;
  });
  return (key, values) => t(key, values, lang.value);
}

export function actionTitle(method: string, fallback: string, translate: Translator): string {
  switch (method) {
    case "connect": case "disconnect": case "wake": return translate(method);
    default: return fallback;
  }
}
