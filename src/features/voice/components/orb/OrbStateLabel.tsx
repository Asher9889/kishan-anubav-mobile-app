import { FontFamily } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import { useEffect } from "react";
import { Text, View } from "react-native";
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

const LABEL_TEXT: Record<VoiceState, string> = {
  idle: "Double tap to speak",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
  loading: "Connecting",
  hidden: "",
  connected: "Connected",
  disconnected: "Disconnected",
  connecting: "Connecting",
  error: "Connection failed",
};

function ListeningDot() {
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

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: Colors.light.primaryContainer,
        },
        style,
      ]}
    />
  );
}

type Props = {
  state: VoiceState;
};

export default function OrbStateLabel({ state }: Props) {
  const text = LABEL_TEXT[state];
  const isActive = state === "listening" || state === "speaking" || state === "thinking";

  if (!text) return null;

  return (
    <View style={{ alignItems: "center", gap: 8, paddingTop: 16 }}>
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
            color: Colors.light.primary,
            letterSpacing: 0.3,
          }}
        >
          {text}
        </Text>
      </Animated.View>
      {state === "listening" && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <ListeningDot />
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
