export type Status = Record<string, unknown>;

export interface Action {
  method: string;
  title: string;
  request?: Record<string, unknown>;
}

export interface AppConfig {
  extension: string;
  title: string;
  glyph: string;
  statusMethod: string;
  kind: "network" | "wake";
  actions: readonly Action[];
}
