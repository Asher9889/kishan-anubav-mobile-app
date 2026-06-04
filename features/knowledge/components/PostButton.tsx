// app/knowledge/_components/controls/PostButton.tsx
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';

interface PostButtonProps {
  onPress: () => void;
  disabled: boolean;
  loading: boolean;
  colors: any;
}

export const PostButton: React.FC<PostButtonProps> = ({
  onPress,
  disabled,
  loading,
  colors,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withSpring(
      disabled ? colors.surfaceContainerHigh : colors.primary,
      { stiffness: 300, damping: 25 }
    ),
    transform: [{ scale: withSpring(disabled ? 0.98 : 1, { stiffness: 400 }) }],
  }));

  return (
    <Pressable onPress={onPress} disabled={disabled || loading}>
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          (disabled || loading) && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.onPrimary} />
        ) : (
          <Text style={[styles.text, { color: disabled ? colors.textMuted : colors.onPrimary }]}>
            Post
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
  },
});