import { Colors } from "@/constants/theme";
import { CircleUserRound, Sprout } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeHeader() {
  const insets = useSafeAreaInsets();

  const colors = Colors.light;

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: colors.primaryContainer,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(219, 194, 176, 0.35)',
        shadowColor: '#79573F',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
      className="px-5 pb-4"
    >

      <View className="flex-row items-center justify-between">
        {/* Left Side */}
        <View className="flex-row items-center gap-3">
          <View
            className="h-10 w-10 items-center justify-center rounded-full border"
            style={{
              backgroundColor: colors.secondaryContainer,
              borderColor: colors.secondary,
            }}
          >
            <Sprout color={colors.primary} size={20} />
          </View>

          <Text className="text-[22px] font-extrabold" style={{ color: colors.text }}>
            Krishi Anubhav AI
          </Text>
        </View>

        {/* Language Button */}
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: colors.surfaceContainerHigh,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
          }}
        >
          <CircleUserRound color={colors.primary} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}