import { Text, View } from "@pocketjs/framework/vue-vapor/components";
import { actionTitle, type Translator } from "../i18n";
import { COLOR, FONT } from "../theme";
import type { Action } from "../types";

interface Props {
  width: number;
  actions: readonly Action[];
  selected: number;
  translate: Translator;
  onAction(index: number): void;
}

export function ActionBar(props: Props) {
  const buttonWidth = Math.max(76, Math.floor((props.width - 30 - (props.actions.length - 1) * 8) / Math.max(1, props.actions.length)));
  return (
    <View class="flex flex-row items-center justify-center gap-2" style={{ width: props.width, height: 54, insetT: 16 }}>
      {props.actions.map((item, index) => (
        <View
          key={item.method}
          class={props.selected === index ? "flex items-center justify-center rounded-xl bg-blue-500" : "flex items-center justify-center rounded-xl bg-zinc-800"}
          style={{ width: buttonWidth, height: 40 }}
          focusable
          onPress={() => props.onAction(index)}
        >
          <Text class="text-sm text-white" style={{ fontSlot: FONT.sm, textColor: COLOR.white }}>{actionTitle(item.method, item.title, props.translate)}</Text>
        </View>
      ))}
    </View>
  );
}
