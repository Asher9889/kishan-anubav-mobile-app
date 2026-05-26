import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import { Mic } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VoiceCTA() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute left-0 right-0 items-center"
      style={{ bottom: Math.max(insets.bottom, 12) + 70 }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open AI chat"
        onPress={() => router.navigate('/ai-chat')}
        className="items-center justify-center"
      >
        <View
          className="absolute rounded-full"
          style={{
            width: 92,
            height: 92,
            backgroundColor: Colors.light.voiceRing,
          }}
        />
        <View
          className="absolute rounded-full"
          style={{
            width: 76,
            height: 76,
            backgroundColor: Colors.light.voicePulse,
          }}
        />
        <View
          className="h-[72px] w-[72px] items-center justify-center rounded-full border"
          style={{
            backgroundColor: Colors.light.primaryContainer,
            borderColor: 'rgba(255,255,255,0.55)',
            shadowColor: Colors.light.primaryContainer,
            shadowOpacity: 0.28,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 8 },
            elevation: 10,
          }}
        >
          <Mic size={32} color="#FFFFFF" />
        </View>
      </Pressable>
    </View>
  );
}