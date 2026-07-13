import { useEffect } from "react";
import {
  Easing,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { VoiceState } from "../types/voice.types";

export default function useVoiceOrb(state: VoiceState) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const glow = useSharedValue(0.35);

  useEffect(() => {
    let glowValue = 0.35;
    let rotationDuration = 10000;
    let enableRotation = true;

    switch (state) {
      case "idle":
      case "hidden":
        glowValue = 0.25;
        rotationDuration = 20000;
        break;

      case "connecting":
      case "loading":
        glowValue = 0.6;
        rotationDuration = 6000;
        break;

      case "listening":
        glowValue = 0.55;
        rotationDuration = 12000;
        break;

      case "thinking":
        glowValue = 0.5;
        rotationDuration = 15000;
        break;

      case "speaking":
        glowValue = 0.75;
        rotationDuration = 8000;
        break;

      case "connected":
        glowValue = 0.35;
        rotationDuration = 10000;
        break;

      case "disconnected":
        glowValue = 0.2;
        enableRotation = false;
        break;
    }

    scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });

    glow.value = withTiming(glowValue, { duration: 300 });

    if (enableRotation) {
      rotation.value = withTiming(360, {
        duration: rotationDuration,
        easing: Easing.linear,
      });
    } else {
      rotation.value = withTiming(0, { duration: 500 });
    }
  }, [state]);

  return {
    scale,
    rotation,
    glow,
  };
}