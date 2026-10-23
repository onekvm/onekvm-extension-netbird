export interface DeviceBridge {
  get?(key: string): string;
  set?(key: string, value: string): void;
}

export function device(): DeviceBridge | undefined {
  return (globalThis as { onekvm?: DeviceBridge }).onekvm;
}

export function hasControl(mode: "touch" | "rotary"): boolean {
  try {
    const modes = JSON.parse(device()?.get?.("controls") || "[]") as unknown;
    return Array.isArray(modes) && modes.includes(mode);
  } catch {
    return false;
  }
}

export function screenSize(): { w: number; h: number } {
  const w = Number(device()?.get?.("screenW") || "240");
  const h = Number(device()?.get?.("screenH") || "240");
  return { w: Number.isFinite(w) && w >= 64 ? Math.round(w) : 240, h: Number.isFinite(h) && h >= 64 ? Math.round(h) : 240 };
}

export function setHot(value: boolean): void {
  device()?.set?.("hot", value ? "1" : "0");
}

export function invoke(extension: string, method: string, request: unknown = {}): void {
  device()?.set?.("appRequest", JSON.stringify({ extension, method, request }));
}
