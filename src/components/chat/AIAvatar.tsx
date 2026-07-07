import { LinearGradient } from "expo-linear-gradient";
import { Sparkles } from "lucide-react-native";

import { Colors } from "@/constants/theme";

interface Props {
  size?: number;
}

export default function AIAvatar({
  size = 36,
}: Props) {
  return (
    <LinearGradient
      colors={[
        Colors.light.primary,
        "#14B8A6",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,

        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Sparkles
        size={size * 0.48}
        color="#FFF"
      />
    </LinearGradient>
  );
}