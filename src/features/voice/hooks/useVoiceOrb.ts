import { useEffect } from "react";
import {
  Easing,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { VoiceState } from "../types/voice.types";

export default function useVoiceOrb(state: VoiceState) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const glow = useSharedValue(0.35);

  useEffect(() => {
    let pulseDuration = 1800;
    let maxScale = 1.03;
    let glowValue = 0.35;

    switch (state) {
      case "loading":
        pulseDuration = 700;
        maxScale = 1.08;
        glowValue = 0.6;
        break;

      case "thinking":
        pulseDuration = 1200;
        maxScale = 1.05;
        glowValue = 0.55;
        break;

      case "speaking":
        pulseDuration = 260;
        maxScale = 1.12;
        glowValue = 0.75;
        break;
    }

    scale.value = withRepeat(
      withSequence(
        withTiming(maxScale, {
          duration: pulseDuration,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: pulseDuration,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1
    );

    glow.value = withTiming(glowValue);

    rotation.value = withRepeat(
      withTiming(360, {
        duration: 10000,
        easing: Easing.linear,
      }),
      -1
    );
  }, [state]);

  return {
    scale,
    rotation,
    glow,
  };
}