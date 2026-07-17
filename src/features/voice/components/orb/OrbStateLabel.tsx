import { FontFamily } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import { useVoiceAssistant } from "@livekit/react-native";
import { RefreshCw } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { VoiceState } from "../../types/voice.types";

function PulsingDot() {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.light.primaryContainer },
        style,
      ]}
    />
  );
}

type Props = {
  state: VoiceState;
  onRetry?: () => void;
};

export default function OrbStateLabel({ state, onRetry }: Props) {
  const { state: agentState } = useVoiceAssistant();

  if (state === "hidden") return null;

  let label: string | null = null;
  let showDot = false;
  let showSubtitle = false;

  if (state === "loading" || state === "connecting") {
    label = "Connecting";
  } else if (state === "error") {
    label = "Connection failed";
  } else if (state === "idle") {
    label = "Double tap to speak";
  } else if (state === "connected" || state === "listening" || state === "speaking" || state === "thinking") {
    if (agentState === "listening") {
      label = "Listening";
      showDot = true;
      showSubtitle = true;
    } else if (agentState === "speaking") {
      label = "Speaking";
    } else if (agentState === "thinking") {
      label = "Thinking";
    }
  }

  if (!label) return null;

  return (
    <View style={{ alignItems: "center", gap: showSubtitle ? 8 : 0, paddingTop: 16 }}>
      <Animated.View
        key={`${state}-${agentState}`}
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
