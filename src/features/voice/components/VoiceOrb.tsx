import {
    BlurMask,
    Canvas,
    Circle,
    Group,
    Path,
    RadialGradient,
    Skia,
    vec,
} from "@shopify/react-native-skia";
import React, { memo, useMemo } from "react";
import { View } from "react-native";
import { useDerivedValue } from "react-native-reanimated";
import { useOrbAnimation } from "../animations/orbAnimation";
import {
    AURA_COLOR,
    CORE_COLOR_INNER,
    CORE_COLOR_OUTER,
    GLOW_COLOR,
    ORB_CANVAS_SIZE,
    ORB_CENTER,
    ORB_RADIUS,
    SHELL_COLOR,
    type OrbState,
} from "../constants/orbConstants";

type Props = {
  state: OrbState;
  size?: number;
};

/**
 * Procedurally builds a closed path approximating a circle whose radius is
 * modulated by a sum of sines. Runs on the UI thread through Skia's derived
 * values so the shape refreshes each frame without React re-renders.
 */
function buildFluidPath(
  time: number,
  baseRadius: number,
  deform: number,
  ripplePhase: number,
  rotation: number,
) {
  "worklet";
  const path = Skia.Path.Make();
  const segments = 96;
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const t = time / 1000;
    const n1 = Math.sin(a * 3 + t * 0.9 + rotation) * 0.6;
    const n2 = Math.sin(a * 5 - t * 1.3 + rotation * 1.7) * 0.35;
    const n3 = Math.sin(a * 2 + t * 0.4) * 0.5;
    const n4 = Math.sin(a * 7 + t * 2.1) * 0.15;
    const rippleTerm = Math.sin(a * 4 - t * 4) * ripplePhase * 0.25;
    const r = baseRadius * (1 + (n1 + n2 + n3 + n4) * deform + rippleTerm);
    const x = ORB_CENTER + Math.cos(a + rotation) * r;
    const y = ORB_CENTER + Math.sin(a + rotation) * r;
    if (i === 0) path.moveTo(x, y);
    else path.lineTo(x, y);
  }
  path.close();
  return path;
}

const VoiceOrbComponent: React.FC<Props> = ({ state, size = ORB_CANVAS_SIZE }) => {
  const anim = useOrbAnimation(state);

  const shellPath = useDerivedValue(() => {
    return buildFluidPath(
      anim.timeMs.value,
      ORB_RADIUS * anim.breathScale.value,
      anim.deform.value,
      anim.ripple.value,
      anim.rotationRad.value,
    );
  });

  const innerPath = useDerivedValue(() => {
    return buildFluidPath(
      anim.timeMs.value * 0.7 + 1234,
      ORB_RADIUS * 0.62 * anim.breathScale.value,
      anim.deform.value * 0.55,
      anim.ripple.value * 0.4,
      -anim.rotationRad.value * 0.8,
    );
  });

  const auraRadius = useDerivedValue(() => {
    return ORB_RADIUS * (1.35 + 0.08 * anim.glowIntensity.value) * anim.breathScale.value;
  });

  const glowRadius = useDerivedValue(() => {
    return ORB_RADIUS * (1.8 + 0.15 * anim.glowIntensity.value) * anim.breathScale.value;
  });

  const glowOpacity = useDerivedValue(() => 0.28 * anim.glowIntensity.value);
  const auraOpacity = useDerivedValue(() => 0.42 * anim.glowIntensity.value);

  // Emitted waves for AI speaking. Three concentric expanding rings, offset in phase.
  const wave1Phase = useDerivedValue(() => (anim.timeMs.value / 3200 + 0.0) % 1);
  const wave2Phase = useDerivedValue(() => (anim.timeMs.value / 3200 + 0.33) % 1);
  const wave3Phase = useDerivedValue(() => (anim.timeMs.value / 3200 + 0.66) % 1);

  const wave1R = useDerivedValue(() => ORB_RADIUS * (1 + wave1Phase.value * 1.2));
  const wave2R = useDerivedValue(() => ORB_RADIUS * (1 + wave2Phase.value * 1.2));
  const wave3R = useDerivedValue(() => ORB_RADIUS * (1 + wave3Phase.value * 1.2));

  const wave1Op = useDerivedValue(() => (1 - wave1Phase.value) * 0.35 * anim.waveEmit.value);
  const wave2Op = useDerivedValue(() => (1 - wave2Phase.value) * 0.28 * anim.waveEmit.value);
  const wave3Op = useDerivedValue(() => (1 - wave3Phase.value) * 0.22 * anim.waveEmit.value);

  const centers = useMemo(() => ({ c: vec(ORB_CENTER, ORB_CENTER) }), []);

  return (
    <View pointerEvents="none">
      <Canvas style={{ width: size, height: size }}>
        {/* Outer soft glow */}
        <Circle cx={ORB_CENTER} cy={ORB_CENTER} r={glowRadius} opacity={glowOpacity} color={GLOW_COLOR}>
          <BlurMask blur={60} style="normal" />
        </Circle>

        {/* Emitted waves (AI speaking) */}
        <Circle cx={ORB_CENTER} cy={ORB_CENTER} r={wave1R} color={GLOW_COLOR} opacity={wave1Op} style="stroke" strokeWidth={1.5}>
          <BlurMask blur={8} style="normal" />
        </Circle>
        <Circle cx={ORB_CENTER} cy={ORB_CENTER} r={wave2R} color={GLOW_COLOR} opacity={wave2Op} style="stroke" strokeWidth={1.5}>
          <BlurMask blur={10} style="normal" />
        </Circle>
        <Circle cx={ORB_CENTER} cy={ORB_CENTER} r={wave3R} color={GLOW_COLOR} opacity={wave3Op} style="stroke" strokeWidth={1.5}>
          <BlurMask blur={14} style="normal" />
        </Circle>

        {/* Aura */}
        <Circle cx={ORB_CENTER} cy={ORB_CENTER} r={auraRadius} opacity={auraOpacity} color={AURA_COLOR}>
          <BlurMask blur={40} style="normal" />
        </Circle>

        {/* Translucent outer shell (fluid) */}
        <Group opacity={0.85}>
          <Path path={shellPath} color={SHELL_COLOR}>
            <RadialGradient
              c={centers.c}
              r={ORB_RADIUS * 1.2}
              colors={["rgba(180,205,255,0.85)", "rgba(80,120,255,0.55)", "rgba(30,50,180,0.15)"]}
              positions={[0.0, 0.55, 1.0]}
            />
            <BlurMask blur={6} style="normal" />
          </Path>
        </Group>

        {/* Inner luminous core */}
        <Group>
          <Path path={innerPath} color={CORE_COLOR_INNER}>
            <RadialGradient
              c={centers.c}
              r={ORB_RADIUS * 0.75}
              colors={[CORE_COLOR_INNER, CORE_COLOR_OUTER, "rgba(80,120,255,0.0)"]}
              positions={[0.0, 0.55, 1.0]}
            />
            <BlurMask blur={10} style="normal" />
          </Path>
        </Group>

        {/* Specular highlight */}
        <Circle
          cx={ORB_CENTER - ORB_RADIUS * 0.28}
          cy={ORB_CENTER - ORB_RADIUS * 0.32}
          r={ORB_RADIUS * 0.18}
          color="rgba(255,255,255,0.55)"
        >
          <BlurMask blur={18} style="normal" />
        </Circle>
      </Canvas>
    </View>
  );
};

export const VoiceOrb = memo(VoiceOrbComponent);