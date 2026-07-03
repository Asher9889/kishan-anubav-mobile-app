import { Text, View } from "react-native";

import { Colors } from "@/constants/theme";

interface Props {
  label: string;
  value: string;
}

export default function MarketStat({
  label,
  value,
}: Props) {
  const c = Colors.light;

  return (
    <View className="items-center flex-1">
      <Text
        className="text-[11px]"
        style={{
          color: c.onSurfaceVariant,
        }}
      >
        {label}
      </Text>

      <Text
        className="mt-1 text-[14px] font-bold"
        style={{
          color: c.onSurface,
        }}
      >
        {value}
      </Text>
    </View>
  );
}