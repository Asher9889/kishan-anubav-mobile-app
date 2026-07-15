import { useVoiceAssistant } from "@livekit/react-native";
import { useEffect, useRef } from "react";
import Animated, {
  useAnimatedStyle,
} from "react-native-reanimated";

import useVoiceOrb from "../../hooks/useVoiceOrb";
import { VoiceState } from "../../types/voice.types";
import OrbCanvas from "./OrbCanvas";

type Props = {
  state: VoiceState;
  size?: number;
};

export default function VoiceOrb({
  state,
  size = 220,
}: Props) {
  const animation = useVoiceOrb(state);
  const { agent } = useVoiceAssistant();
  const agentRef = useRef(agent ?? null);
  agentRef.current = agent ?? null;
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const poll = () => {
      const level = agentRef.current?.audioLevel ?? 0;
      animation.setAudioLevel(level);
      frameRef.current = requestAnimationFrame(poll);
    };

    frameRef.current = requestAnimationFrame(poll);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [animation.setAudioLevel]);

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        scale: animation.scale.value * animation.audioScale.value,
      },
    ],
  }));

  return (
    <Animated.View style={[style, { backgroundColor: 'transparent' }]}>
      <OrbCanvas state={state} />
    </Animated.View>
  );
}