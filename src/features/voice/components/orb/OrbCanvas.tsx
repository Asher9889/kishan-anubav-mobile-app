import { Canvas, Fill, Shader } from "@shopify/react-native-skia";
import { useEffect, useState } from "react";

import { orbShader } from "../../shaders/OrbShader";

export default function OrbCanvas() {
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
          }}
        />
      </Fill>
    </Canvas>
  );
}