import { FontFamily } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import {
  useLocalParticipant,
  useTrackVolume,
} from "@livekit/react-native";
import { Track } from "livekit-client";
import { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  View
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SEGMENT_COUNT = 24;
const BAR_HEIGHT = 6;
const BAR_WIDTH = Math.min(SCREEN_WIDTH * 0.55, 220);
const SEGMENT_GAP = 1.5;

const ATTACK_SPEED = 0.25;
const RELEASE_SPEED = 0.08;

const GRADIENT = [
  { r: 105, g: 56, b: 0 },
  { r: 143, g: 78, b: 0 },
  { r: 255, g: 153, b: 51 },
  { r: 255, g: 183, b: 122 },
];

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

export default function EnergyBar() {
  const { localParticipant } = useLocalParticipant();

  const micPublication =
    localParticipant?.getTrackPublication(
      Track.Source.Microphone,
    );

  const micTrack = micPublication?.audioTrack;

  /**
   * LiveKit audio level.
   * 0 = silence
   * 1 = maximum audio level
   */
  const volume = useTrackVolume(micTrack);

  /**
   * Raw LiveKit value.
   */
  const targetLevel = useSharedValue(0);

  /**
   * Smoothed value rendered by the UI.
   */
  const displayLevel = useSharedValue(0);

  /**
   * Receive LiveKit's audio level.
   */
  useEffect(() => {
    targetLevel.value = Math.min(
      100,
      Math.max(0, (volume ?? 0) * 100),
    );
  }, [volume]);

  /**
   * Smooth the visual meter on the UI thread.
   *
   * Fast when audio increases.
   * Slow when audio decreases.
   */
  useFrameCallback((frame) => {
    const current = displayLevel.value;
    const target = targetLevel.value;

    const delta =
      frame.timeSincePreviousFrame ?? 16.67;

    const frameFactor = Math.min(
      delta / 16.67,
      2,
    );

    const speed =
      target > current
        ? ATTACK_SPEED
        : RELEASE_SPEED;

    const amount = Math.min(
      1,
      speed * frameFactor,
    );

    displayLevel.value =
      current + (target - current) * amount;
  });

  const glowStyle = useAnimatedStyle(() => {
    const level = displayLevel.value / 100;

    return {
      opacity: level > 0.02
        ? 0.2 + level * 0.5
        : 0,
    };
  });

  const percentageProps = useAnimatedProps(() => ({
    text: `${Math.round(displayLevel.value)}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.barWrapper}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.glow,
              glowStyle,
            ]}
          />

          <View style={styles.track}>
            {Array.from({
              length: SEGMENT_COUNT,
            }).map((_, index) => (
              <Segment
                key={index}
                index={index}
                level={displayLevel}
              />
            ))}
          </View>
        </View>

        <Animated.Text
          animatedProps={percentageProps}
          style={styles.percentageText}
        />
      </View>
    </View>
  );
}

function Segment({
  index,
  level,
}: {
  index: number;
  level: SharedValue<number>;
}) {
  const threshold =
    ((index + 1) / SEGMENT_COUNT) * 100;

  const color = sampleGradient(
    index / (SEGMENT_COUNT - 1),
  );

  const isFirst = index === 0;
  const isLast = index === SEGMENT_COUNT - 1;

  const radius = (BAR_HEIGHT - 2) / 2;

  const animatedStyle = useAnimatedStyle(() => {
    const value = level.value;

    let opacity = 0;

    if (value >= threshold) {
      opacity = 1;
    } else if (value >= threshold - 7) {
      opacity =
        (value - (threshold - 7)) / 7;
    }

    const boost = 0.75 + opacity * 0.45;

    return {
      opacity: Math.max(0.12, opacity),

      backgroundColor: `rgb(
        ${Math.round(color.r * boost)},
        ${Math.round(color.g * boost)},
        ${Math.round(color.b * boost)}
      )`,
    };
  });

  return (
    <Animated.View
      style={[
        styles.segment,
        {
          marginLeft: isFirst
            ? 1
            : SEGMENT_GAP,

          borderTopLeftRadius: isFirst
            ? radius
            : 1,

          borderBottomLeftRadius: isFirst
            ? radius
            : 1,

          borderTopRightRadius: isLast
            ? radius
            : 1,

          borderBottomRightRadius: isLast
            ? radius
            : 1,
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
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  barWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  glow: {
    position: "absolute",
    width: BAR_WIDTH + 24,
    height: BAR_HEIGHT + 24,
    borderRadius: (BAR_HEIGHT + 24) / 2,
    backgroundColor: Colors.light.voiceGlow,
  },

  track: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor:
      Colors.light.surfaceContainerLow,
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

  percentageText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.light.textSecondary,
    minWidth: 38,
    textAlign: "right",
  },
});