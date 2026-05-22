import { Colors } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { Globe, Sprout } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeHeader() {
  const insets = useSafeAreaInsets();

  const colors = Colors.light;

  return (
    <BlurView
      intensity={30}
      style={{
        paddingTop: insets.top,
        backgroundColor: "green",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
      className="overflow-hidden px-5 pb-4"
    >
      {/* <LinearGradient
        colors={[colors.primaryDark, colors.primary, colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      /> */}

      <View className="flex-row items-center justify-between">
        {/* Left Side */}
        <View className="flex-row items-center gap-3">
          <View
            className="h-11 w-11 items-center justify-center rounded-full border bg-white/14"
            style={{
              borderColor: "rgba(255,255,255,0.18)",
            }}
          >
            <Sprout color="#FFFFFF" size={24} />
          </View>

          <Text
            className="text-2xl font-extrabold"
            style={{
              color: "#FFFFFF",
            }}
          >
            Krishi Anubhav AI
          </Text>
        </View>

        {/* Language Button */}
        <TouchableOpacity
          className="flex-row items-center rounded-full px-4 py-2"
          style={{
            backgroundColor: "rgba(255,255,255,0.92)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.65)",
          }}
        >
          <Globe color={colors.primaryDark} size={18} />

          <Text
            className="ml-2 font-semibold"
            style={{
              color: colors.primaryDark,
            }}
          >
            हिंदी
          </Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
}