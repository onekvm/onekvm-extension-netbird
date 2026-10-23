import { Text, View } from "@pocketjs/framework/vue-vapor/components";
import { COLOR, FONT } from "../theme";

interface Props {
  width: number;
  busy: boolean;
  offline: boolean;
  status: string;
  summary: string;
  message: string;
}

export function StatusCard(props: Props) {
  return (
    <View class="flex flex-col items-center justify-center rounded-xl" style={{ width: Math.min(216, props.width - 24), height: 92, bgColor: COLOR.panel }}>
      <Text class="text-base text-white" style={{ fontSlot: FONT.base, textColor: props.busy ? COLOR.warning : props.offline ? COLOR.muted : COLOR.success }}>{props.status}</Text>
      <Text class="text-sm text-white" style={{ fontSlot: FONT.sm, textColor: COLOR.white }}>{props.summary}</Text>
      {props.message ? <Text class="text-xs text-white" style={{ fontSlot: FONT.xs, textColor: COLOR.danger }}>{props.message}</Text> : null}
    </View>
  );
}
