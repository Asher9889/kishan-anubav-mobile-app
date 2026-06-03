// components/news-detail/animations/ParallaxImage.tsx
import React from 'react';
import { ImageSourcePropType, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';

interface ParallaxImageProps {
  source: ImageSourcePropType;
  scrollY: Animated.SharedValue<number>;
  height: number;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  source,
  scrollY,
  height,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    const offset = scrollY.value;
    if (offset <= 0) {
      scale.value = 1 + Math.abs(offset) / 400;
    }
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.Image
      source={source}
      style={[
        StyleSheet.absoluteFill,
        { height, width: '100%' },
        animatedStyle,
      ]}
      resizeMode="cover"
    />
  );
};