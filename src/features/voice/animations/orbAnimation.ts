import { useEffect } from "react";
import { cancelAnimation, Easing, useDerivedValue, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { STATE_CONFIG, TRANSITION_DURATION, type OrbState } from "../constants/orbConstants";

/**
 * Central animation controller.npm run
 *
 * Everything runs on the UI thread through Reanimated shared values.
 * State transitions are interpolated smoothly via withTiming so that the
 * visual parameters (breath amplitude, deformation, glow...) never snap.
 *
 * A single monotonically increasing clock drives all procedural motion.
 * Individual layers derive their own oscillations from that clock using
 * incommensurate frequencies to avoid obvious looping.
 */
export function useOrbAnimation(state: OrbState) {
  const clock = useSharedValue(0);

  const breathAmplitude = useSharedValue(STATE_CONFIG.idle.breathAmplitude);
  const breathSpeed = useSharedValue(STATE_CONFIG.idle.breathSpeed);
  const deform = useSharedValue(STATE_CONFIG.idle.deform);
  const ripple = useSharedValue(STATE_CONFIG.idle.ripple);
  const glow = useSharedValue(STATE_CONFIG.idle.glow);
  const rotation = useSharedValue(STATE_CONFIG.idle.rotation);
  const waveEmit = useSharedValue(STATE_CONFIG.idle.waveEmit);

  useEffect(() => {
    clock.value = 0;
    clock.value = withRepeat(
      withTiming(1, { duration: 60000, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(clock);
  }, [clock]);

  useEffect(() => {
    const cfg = STATE_CONFIG[state];
    const t = { duration: TRANSITION_DURATION, easing: Easing.inOut(Easing.cubic) };
    breathAmplitude.value = withTiming(cfg.breathAmplitude, t);
    breathSpeed.value = withTiming(cfg.breathSpeed, t);
    deform.value = withTiming(cfg.deform, t);
    ripple.value = withTiming(cfg.ripple, t);
    glow.value = withTiming(cfg.glow, t);
    rotation.value = withTiming(cfg.rotation, t);
    waveEmit.value = withTiming(cfg.waveEmit, t);
  }, [state, breathAmplitude, breathSpeed, deform, ripple, glow, rotation, waveEmit]);

  const timeMs = useDerivedValue(() => clock.value * 60000);

  const breathScale = useDerivedValue(() => {
    const t = timeMs.value;
    const primary = Math.sin((t / breathSpeed.value) * Math.PI * 2);
    const secondary = Math.sin((t / (breathSpeed.value * 0.73)) * Math.PI * 2) * 0.35;
    return 1 + (primary + secondary) * breathAmplitude.value * 0.5;
  });

  const rotationRad = useDerivedValue(() => {
    return (timeMs.value / 12000) * Math.PI * 2 * rotation.value;
  });

  const glowIntensity = useDerivedValue(() => {
    const t = timeMs.value;
    const flicker = 0.9 + Math.sin(t / 1900) * 0.05 + Math.sin(t / 733) * 0.03;
    return glow.value * flicker;
  });

  return {
    timeMs,
    breathScale,
    rotationRad,
    glowIntensity,
    deform,
    ripple,
    waveEmit,
  };
}

export type OrbAnimation = ReturnType<typeof useOrbAnimation>;