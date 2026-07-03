import { TrendingDown, TrendingUp } from "lucide-react-native";
import { Text, View } from "react-native";

import { Colors } from "@/constants/theme";

interface Props {
  trend: "up" | "down";
  change: string;
}

export default function MarketTrendBadge({
  trend,
  change,
}: Props) {
  const c = Colors.light;

  const positive = trend === "up";

  const color = positive ? c.secondary : c.error;

  return (
    <View
      className="flex-row items-center self-start rounded-full px-2.5 py-1"
      style={{
        backgroundColor: positive
          ? "#E9F8EE"
          : "#FDECEC",
      }}
    >
      {positive ? (
        <TrendingUp
          size={12}
          color={color}
        />
      ) : (
        <TrendingDown
          size={12}
          color={color}
        />
      )}

      <Text
        className="ml-1 text-[11px] font-bold"
        style={{
          color,
        }}
      >
        {change}
      </Text>
    </View>
  );
}