import { useLocalParticipant } from "@livekit/react-native";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const BAR_COUNT = 5;
const BAR_WIDTH = 3;
const BAR_GAP = 3;
const MAX_BAR_HEIGHT = 20;
const POLL_INTERVAL_MS = 50;

export default function WaveAnimation() {
  const { localParticipant } = useLocalParticipant();
  const agentRef = useRef(localParticipant ?? null);
  agentRef.current = localParticipant ?? null;
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const poll = () => {
      const level = agentRef.current?.audioLevel ?? 0;
      audioLevelRef.current = level;
      frameRef.current = requestAnimationFrame(poll);
    };

    frameRef.current = requestAnimationFrame(poll);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [localParticipant]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: MAX_BAR_HEIGHT + 4,
        marginTop: 8,
      }}
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <WaveBar key={i} index={i} />
      ))}
    </View>
  );
}

const audioLevelRef = { current: 0 };

function WaveBar({ index }: { index: number }) {
  const height = useSharedValue(4);
  const opacity = useSharedValue(0.4);

  const offset = index - Math.floor(BAR_COUNT / 2);
  const absOffset = Math.abs(offset);

  useEffect(() => {
    const id = setInterval(() => {
      const level = audioLevelRef.current;
      const baseHeight = 4 + level * MAX_BAR_HEIGHT;
      const stagger = Math.max(0.5, 1 - absOffset * 0.15);
      const targetHeight = Math.min(MAX_BAR_HEIGHT, baseHeight * stagger);

      height.value = withTiming(targetHeight, {
        duration: 80,
        easing: Easing.out(Easing.ease),
      });

      opacity.value = withTiming(0.4 + level * 0.6, {
        duration: 80,
      });
    }, POLL_INTERVAL_MS);

    return () => clearInterval(id);
  }, [absOffset, height, opacity]);

  useEffect(() => {
    height.value = withRepeat(
      withSequence(
        withTiming(6 + (index % 2) * 3, {
          duration: 400 + index * 50,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(4, {
          duration: 400 + index * 50,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, [height, index]);

  const style = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: BAR_WIDTH,
          marginHorizontal: BAR_GAP / 2,
          borderRadius: BAR_WIDTH / 2,
          backgroundColor: "#6366f1",
        },
        style,
      ]}
    />
  );
}
