// app/knowledge/_components/cards/ImagePreviewCard.tsx
import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_SIZE = (SCREEN_W - 64) / 3; // 3 columns with gaps

interface ImagePreviewCardProps {
  image: { id: string; uri: string };
  index: number;
  onRemove: (id: string) => void;
  colors: any;
}

export const ImagePreviewCard: React.FC<ImagePreviewCardProps> = ({
  image,
  index,
  onRemove,
  colors,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1) }],
    opacity: withTiming(1, { duration: 300 }),
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image source={{ uri: image.uri }} style={styles.image} resizeMode="cover" />
      
      {/* Remove button */}
      <Pressable
        onPress={() => onRemove(image.id)}
        style={[styles.removeButton, { backgroundColor: colors.error }]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.removeIcon}>✕</Text>
      </Pressable>

      {/* Index badge */}
      <View style={[styles.indexBadge, { backgroundColor: colors.primary }]}>
        <Text style={[styles.indexText, { color: colors.onPrimary }]}>{index + 1}</Text>
      </View>
    </Animated.View>
  );
};

// Need Text import
import { Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  removeIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  indexBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    fontSize: 10,
    fontWeight: '700',
  },
});