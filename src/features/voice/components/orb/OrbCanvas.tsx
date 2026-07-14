import { Canvas, Fill, Shader } from "@shopify/react-native-skia";
import { useEffect, useRef, useState } from "react";

import { orbShader } from "../../shaders/OrbShader";
import { VoiceState } from "../../types/voice.types";

type Props = {
  state: VoiceState;
};

const stateMap: Record<VoiceState, number> = {
  idle: 0,
  listening: 1,
  thinking: 2,
  speaking: 3,
  loading: 5,
  hidden: 4,
  connected: 6,
  disconnected: 4,
  connecting: 5,
};

const TRANSITION_DURATION = 500;

export default function OrbCanvas({ state }: Props) {
  const [time, setTime] = useState(0);
  const [transition, setTransition] = useState(1);
  const prevStateRef = useRef(state);
  const transitionStartRef = useRef(0);

  // Track previous state (runs after each render, so prevStateRef holds old value during next render)
  useEffect(() => {
    prevStateRef.current = state;
  });

  // Start transition when state changes
  const stateValue = stateMap[state] ?? 0;
  useEffect(() => {
    transitionStartRef.current = performance.now();
    setTransition(0);
  }, [stateValue]);

  useEffect(() => {
    let frameId: number;
    let start = performance.now();

    const animate = (now: number) => {
      setTime((now - start) / 1000);

      const elapsed = now - transitionStartRef.current;
      setTransition(Math.min(elapsed / TRANSITION_DURATION, 1));

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, []);

  const prevStateValue = stateMap[prevStateRef.current] ?? 0;

  return (
    <Canvas
      style={{
        width: 240,
        height: 240,
      }}
    >
      <Fill>
        <Shader
          source={orbShader}
          uniforms={{
            resolution: [240, 240],
            time,
            state: stateValue,
            prevState: prevStateValue,
            transition,
          }}
        />
      </Fill>
    </Canvas>
  );
}