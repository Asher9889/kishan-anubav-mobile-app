import { Logo } from "@/components";
import { Colors } from "@/constants/theme";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeHeader() {
  const insets = useSafeAreaInsets();

  // const onProfileClick = () => {
  //   router.push("/(private)/(tabs)/profile");
  // }

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
          {/* <View
            className="h-10 w-10 items-center justify-center rounded-full border"
            style={{
              backgroundColor: colors.secondaryContainer,
              borderColor: colors.secondary,
            }}
          > */}
            <Logo width={50} height={50} />
            {/* <Sprout color={colors.primary} size={20} /> */}
          {/* </View> */}

          <Text className="text-[22px] font-extrabold" style={{ color: colors.text }}>
            Krishi Anubhav AI
          </Text>
        </View>

        {/* Language Button */}
        {/* <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: colors.surfaceContainerHigh,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
          }}
          // onPress={onProfileClick}
        >
          {/* <Image style={{height: 40, width: 40, borderRadius: 20, }}  source={avatar} /> */}
          {/* <CircleUserRound color={colors.primary} size={20} /> */}
        {/* </TouchableOpacity>  */}
      </View>
    </View>
  );
}