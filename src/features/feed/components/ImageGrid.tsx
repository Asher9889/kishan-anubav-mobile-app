import { Image } from 'expo-image';
import { useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

interface ImageGridProps {
  images: string[];
  onImagePress: (index: number) => void;
}

const IMAGE_ASPECT_RATIO = 4 / 5;
const { width: SW } = Dimensions.get('window');

export default function ImageGrid({ images, onImagePress }: ImageGridProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = createStyles(theme);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(new Set());
  const listRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  if (images.length === 0) return null;

  const renderItem = ({ item: uri, index }: { item: string; index: number }) => (
    <Pressable onPress={() => onImagePress(index)}>
      {failed.has(index) ? (
        <View style={[styles.image, styles.failed]}>
          <Text style={styles.failedText}>!</Text>
        </View>
      ) : (
        <Image
          source={{ uri }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          onError={() => setFailed((prev) => new Set(prev).add(index))}
        />
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(uri, i) => `${uri}-${i}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SW}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={images.length > 1}
      />
      {images.length > 1 && (
        <View style={styles.dots}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginTop: 14,
    },
    image: {
      width: SW,
      aspectRatio: IMAGE_ASPECT_RATIO,
      backgroundColor: theme.surfaceContainerLow,
    },
    failed: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    failedText: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.textMuted,
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      paddingTop: 10,
      paddingBottom: 2,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.borderLight,
    },
    dotActive: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.primary,
    },
  });
