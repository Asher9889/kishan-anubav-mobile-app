import { FontFamily } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import { RefreshCw } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeOutUp,
} from "react-native-reanimated";
import { VoiceState } from "../../types/voice.types";

type Props = {
  state: VoiceState;
  onRetry?: () => void;
};

export default function OrbStateLabel({ state, onRetry }: Props) {
  if (state === "hidden") return null;

  let label: string | null = null;
  let showDot = false;
  let showSubtitle = false;

  switch (state) {
    case "loading":
    case "connecting":
      label = "Connecting";
      break;
    case "error":
      label = "Connection failed";
      break;
    case "idle":
      label = "Double tap to speak";
      break;
    case "connected":
      label = "Connected";
      break;
    case "listening":
      label = "Listening";
      showDot = true;
      showSubtitle = true;
      break;
    case "thinking":
      label = "Thinking";
      break;
    case "speaking":
      label = "Speaking";
      break;
    case "disconnected":
      label = "Disconnected";
      break;
  }

  if (!label) return null;

  return (
    <View style={{ alignItems: "center", gap: showSubtitle ? 8 : 0, paddingTop: 16 }}>
      <Animated.View
        key={state}
        entering={FadeInDown.duration(200).easing(Easing.out(Easing.ease)).withInitialValues({ opacity: 0, transform: [{ translateY: -8 }] })}
        exiting={FadeOutUp.duration(150).easing(Easing.in(Easing.ease))}
      >
        <Text
          style={{
            fontFamily: FontFamily.semiBold,
            fontSize: 16,
            lineHeight: 22,
            color: state === "error" ? Colors.light.error : Colors.light.text,
            letterSpacing: 0.3,
          }}
        >
          {label}
        </Text>
      </Animated.View>
      {state === "error" && onRetry && (
        <Pressable
          onPress={onRetry}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: Colors.light.primary,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 9999,
            marginTop: 12,
          }}
        >
          <RefreshCw size={14} color="#fff" />
          <Text style={{ fontFamily: FontFamily.semiBold, fontSize: 14, color: "#fff" }}>
            Retry
          </Text>
        </Pressable>
      )}
      {showSubtitle && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {showDot && <PulsingDot />}
          <Text
            style={{
              fontFamily: FontFamily.medium,
              fontSize: 13,
              color: Colors.light.primaryContainer,
              letterSpacing: 0.8,
              opacity: 0.85,
            }}
          >
            I'M READY
          </Text>
        </View>
      )}
    </View>
  );
}

function PulsingDot() {
  return (
    <Animated.View
      entering={FadeInDown.duration(200)}
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.light.primaryContainer,
        opacity: 0.7,
      }}
    />
  );
}
