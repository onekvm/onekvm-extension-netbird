import { Text, View } from "@pocketjs/framework/vue-vapor/components";
import { ActionBar } from "./components/ActionBar";
import { StatusCard } from "./components/StatusCard";
import { CONFIG } from "./config";
import { screenSize } from "./device";
import { useI18n } from "./i18n";
import { statusLabel, summary } from "./status";
import { COLOR, FONT } from "./theme";
import { useExtension } from "./useExtension";

export default function App() {
  const t = useI18n();
  const screen = screenSize();
  const controls = useExtension();

  return (
    <View class="relative w-full h-full bg-black flex flex-col items-center" style={{ width: screen.w, height: screen.h }}>
      <View class="flex flex-row items-center justify-center" style={{ width: screen.w, height: 34 }}>
        <Text class="text-base text-white" style={{ fontSlot: FONT.base, textColor: COLOR.white }}>{CONFIG.glyph}  {CONFIG.kind === "wake" ? t("wakeTitle") : CONFIG.title}</Text>
      </View>
      <StatusCard
        width={screen.w}
        busy={controls.busy.value}
        offline={controls.state.value.online === false}
        status={controls.busy.value ? t("busy") : statusLabel(controls.state.value, t)}
        summary={summary(controls.state.value, t)}
        message={controls.message.value ? t(controls.message.value) : ""}
      />
      <ActionBar width={screen.w} actions={CONFIG.actions} selected={controls.selected.value} translate={t} onAction={controls.press} />
      <View class="flex items-center justify-center" style={{ width: screen.w, height: 34, insetT: 12 }}>
        <Text class="text-xs text-zinc-400" style={{ fontSlot: FONT.xs, textColor: COLOR.muted }}>{t("holdBack")}</Text>
      </View>
    </View>
  );
}
