import { useMultibandTrackVolume, useVoiceAssistant } from "@livekit/react-native";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Colors } from "@/constants/theme";

type AgentState =
  | "disconnected"
  | "connecting"
  | "pre-connect-buffering"
  | "failed"
  | "initializing"
  | "idle"
  | "listening"
  | "thinking"
  | "speaking";

const SEGMENT_COUNT = 24;
const BAR_HEIGHT = 5;
const SEGMENT_GAP = 1.5;

const GRADIENT = [
  { r: 105, g: 56, b: 0 },
  { r: 143, g: 78, b: 0 },
  { r: 255, g: 153, b: 51 },
  { r: 255, g: 183, b: 122 },
];

const DIM_OPACITY = 0.2;

const sequencerIntervals: Partial<Record<AgentState, number>> = {
  connecting: 2000,
  initializing: 2000,
  listening: 500,
  thinking: 150,
};

function getSequencerInterval(
  state: AgentState | undefined,
  barCount: number
): number {
  if (!state) return 1000;
  const base = sequencerIntervals[state];
  if (!base) return 100;
  return state === "connecting" || state === "initializing"
    ? base / barCount
    : base;
}

function sampleGradient(t: number) {
  const c = Math.max(0, Math.min(1, t));
  const i = c * (GRADIENT.length - 1);
  const lo = Math.floor(i);
  const hi = Math.min(lo + 1, GRADIENT.length - 1);
  const f = i - lo;
  return {
    r: GRADIENT[lo].r + (GRADIENT[hi].r - GRADIENT[lo].r) * f,
    g: GRADIENT[lo].g + (GRADIENT[hi].g - GRADIENT[lo].g) * f,
    b: GRADIENT[lo].b + (GRADIENT[hi].b - GRADIENT[lo].b) * f,
  };
}

function generateConnectingSequence(count: number): number[][] {
  const seq: number[][] = [[]];
  for (let x = 0; x < count; x++) {
    seq.push([x, count - 1 - x]);
  }
  return seq;
}

function generateListeningSequence(count: number): number[][] {
  const center = Math.floor(count / 2);
  return [[center], [-1]];
}

function useBarAnimator(
  state: AgentState | undefined,
  columns: number,
  interval: number
): number[] {
  const [index, setIndex] = useState(0);
  const [sequence, setSequence] = useState<number[][]>([[]]);

  useEffect(() => {
    if (state === "connecting" || state === "initializing") {
      setSequence(generateConnectingSequence(columns));
    } else if (state === "listening" || state === "thinking") {
      setSequence(generateListeningSequence(columns));
    } else if (state === "speaking" || state === "idle" || !state) {
      setSequence([Array.from({ length: columns }, (_, i) => i)]);
    } else {
      setSequence([[]]);
    }
    setIndex(0);
  }, [state, columns]);

  const rafId = useRef<number | null>(null);
  useEffect(() => {
    let startTime = performance.now();
    const animate = (time: number) => {
      if (time - startTime >= interval) {
        setIndex((prev) => prev + 1);
        startTime = time;
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [interval, sequence.length]);

  return sequence[index % sequence.length] ?? [];
}

interface Props {
  barCount?: number;
  style?: ViewStyle;
}

export default function HorizontalBarVisualizer({
  barCount = SEGMENT_COUNT,
  style,
}: Props) {
  const { state, audioTrack } = useVoiceAssistant();
  const magnitudes = useMultibandTrackVolume(audioTrack, { bands: barCount });
  const fillLevel = useSharedValue(0);

  const interval = getSequencerInterval(state, barCount);
  const highlightedIndices = useBarAnimator(state, barCount, interval);

  useEffect(() => {
    const avg = magnitudes.length
      ? magnitudes.reduce((s, v) => s + v, 0) / magnitudes.length
      : 0;
    fillLevel.value = Math.min(100, avg * 100);
  }, [magnitudes, fillLevel]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: fillLevel.value > 2 ? 0.6 : 0,
  }));

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.glow, glowStyle]} />
      <View style={styles.track}>
        {Array.from({ length: barCount }).map((_, i) => (
          <Segment
            key={i}
            index={i}
            count={barCount}
            magnitude={magnitudes[i] ?? 0}
            highlighted={highlightedIndices.includes(i)}
          />
        ))}
      </View>
    </View>
  );
}

function Segment({
  index,
  count,
  magnitude,
  highlighted,
}: {
  index: number;
  count: number;
  magnitude: number;
  highlighted: boolean;
}) {
  const opacity = useSharedValue(DIM_OPACITY);
  const color = sampleGradient(index / (count - 1));

  useEffect(() => {
    const target = highlighted ? 1 : DIM_OPACITY;
    opacity.value = withTiming(target, {
      duration: highlighted ? 200 : 300,
      easing: Easing.out(Easing.quad),
    });
  }, [highlighted, opacity]);

  const isFirst = index === 0;
  const isLast = index === count - 1;
  const r = (BAR_HEIGHT - 2) / 2;

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    backgroundColor: `rgb(${Math.round(color.r)},${Math.round(color.g)},${Math.round(color.b)})`,
  }));

  return (
    <Animated.View
      style={[
        styles.segment,
        {
          marginLeft: isFirst ? 1 : SEGMENT_GAP,
          borderTopLeftRadius: isFirst ? r : 1,
          borderBottomLeftRadius: isFirst ? r : 1,
          borderTopRightRadius: isLast ? r : 1,
          borderBottomRightRadius: isLast ? r : 1,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    marginBottom: 6,
    position: "relative",
  },
  glow: {
    position: "absolute",
    width: "100%",
    height: BAR_HEIGHT + 24,
    borderRadius: (BAR_HEIGHT + 24) / 2,
    backgroundColor: Colors.light.voiceGlow,
  },
  track: {
    width: "100%",
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: Colors.light.surfaceContainerLow,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: Colors.light.primaryMuted,
  },
  segment: {
    flex: 1,
    height: BAR_HEIGHT - 2,
  },
});
