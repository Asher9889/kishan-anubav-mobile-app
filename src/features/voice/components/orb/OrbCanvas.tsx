import { Canvas, Fill, Shader } from "@shopify/react-native-skia";
import { useEffect, useState } from "react";

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

export default function OrbCanvas({ state }: Props) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frameId: number;
    let start = performance.now();

    const animate = (now: number) => {
      setTime((now - start) / 1000);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, []);

  const stateValue = stateMap[state] ?? 0;

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
          }}
        />
      </Fill>
    </Canvas>
  );
}