import React from "react";

import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import {
  ImagePlus,
  Mic,
} from "lucide-react-native";

import { Colors } from "@/constants/theme";

import ChatActionButton from "./ChatActionButton";
import { styles } from "./styles";

interface Props {
  expanded: SharedValue<boolean>;

  onImagePress: () => void;
  onMicPress: () => void;
}

export default function ChatInputMenu({
  expanded,
  onImagePress,
  onMicPress,
}: Props) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(expanded.value ? 1 : 0),

      transform: [
        {
          translateY: withSpring(
            expanded.value ? 0 : 20
          ),
        },
        {
          scale: withSpring(
            expanded.value ? 1 : 0.8
          ),
        },
      ],

      pointerEvents: expanded.value
        ? "auto"
        : "none",
    };
  });

  return (
    <Animated.View
      style={[styles.floatingMenu, animatedStyle]}
    >
      <ChatActionButton
        onPress={onImagePress}
        colors={[
          Colors.light.primaryContainer,
          "#14B8A6",
        ]}
        size="menu"
      >
        <ImagePlus
          size={22}
          color="#FFFFFF"
        />
      </ChatActionButton>

      <Animated.View
        style={{ marginBottom: 10 }}
      >
        <ChatActionButton
          onPress={onMicPress}
          colors={[
            Colors.light.primaryContainer,
            "#FFB77A",
          ]}
          size="menu"
        >
          <Mic
            size={22}
            color="#FFFFFF"
          />
        </ChatActionButton>
      </Animated.View>
    </Animated.View>
  );
}