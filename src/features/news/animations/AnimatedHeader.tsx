// components/news-detail/animations/AnimatedHeader.tsx
import React from 'react';
import { Platform, Pressable, StatusBar, StyleSheet } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
} from 'react-native-reanimated';

interface AnimatedHeaderProps {
  scrollY: Animated.SharedValue<number>;
  title: string;
  onBackPress: () => void;
  onSharePress: () => void;
  backgroundColor: string;
  glassColor: string;
  textColor: string;
  primaryColor: string;
  primaryMuted: string;
}

export const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  scrollY,
  title,
  onBackPress,
  onSharePress,
  backgroundColor,
  glassColor,
  textColor,
  primaryColor,
  primaryMuted,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 200],
      [0, 1],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 200],
      [-20, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        { backgroundColor: glassColor },
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: backgroundColor, opacity: 0.85 },
        ]}
      />
      <Pressable
        onPress={onBackPress}
        style={[styles.button, { backgroundColor: primaryMuted }]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[styles.icon, { color: primaryColor }]}>←</Text>
      </Pressable>
      <Animated.Text
        numberOfLines={1}
        style={[styles.title, { color: textColor }]}
      >
        {title}
      </Animated.Text>
      <Pressable
        onPress={onSharePress}
        style={[styles.button, { backgroundColor: primaryMuted }]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[styles.icon, { color: primaryColor }]}>↗</Text>
      </Pressable>
    </Animated.View>
  );
};

// Need to import Text for this to work
import { Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24),
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    fontWeight: '700',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 16,
    textAlign: 'center',
  },
});