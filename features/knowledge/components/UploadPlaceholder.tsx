// app/knowledge/_components/cards/UploadPlaceholder.tsx
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_SIZE = (SCREEN_W - 64) / 3;

interface UploadPlaceholderProps {
  onPress: () => void;
  remaining: number;
  colors: any;
}

export const UploadPlaceholder: React.FC<UploadPlaceholderProps> = ({
  onPress,
  remaining,
  colors,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1) }],
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          {
            borderColor: colors.border,
            backgroundColor: colors.surfaceContainerLow,
          },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: colors.primaryMuted }]}>
          <Text style={[styles.plusIcon, { color: colors.primary }]}>+</Text>
        </View>
        <Text style={[styles.label, { color: colors.textMuted }]}>
          Add Photo
        </Text>
        <Text style={[styles.remaining, { color: colors.textMuted }]}>
          {remaining} left
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 24,
    fontWeight: '300',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  remaining: {
    fontSize: 10,
    fontWeight: '500',
  },
});