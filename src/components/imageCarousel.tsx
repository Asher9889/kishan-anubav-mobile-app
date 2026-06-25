// components/PremiumImageCarousel.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

const CARD_HEIGHT = 220;
const AUTO_PLAY_INTERVAL = 8000; // 8 seconds



// ─── Types ─────────────────────────────────────────────
export interface CarouselItem {
  id: string;
  tag: string;           // e.g., "नई योजना सूचना"
  title: string;         // e.g., "पीएम-किसान 15वीं किस्त जारी"
  subtitle: string;      // e.g., "सोनीपत के 15,000+ किसानों के खातों में पैसे पहुँचे।"
  image: any;            // require('./assets/image.png') or { uri: '...' }
  accentColor?: string;  // e.g., '#C17F2E'
  backgroundColor?: string;
}

interface PremiumImageCarouselProps {
  data: CarouselItem[];
  onCardPress?: (item: CarouselItem, index: number) => void;
  containerStyle?: ViewStyle;
  cardStyle?: ViewStyle;
  showPagination?: boolean;
  showProgressBar?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
}

// ─── Sub-Components ──────────────────────────────────

/**
 * Animated Progress Bar that fills over 8 seconds
 */
const ProgressBar: React.FC<{
  active: boolean;
  duration: number;
  onComplete?: () => void;
}> = ({ active, duration, onComplete }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (active) {
      progress.value = 0;
      progress.value = withTiming(1, { duration }, (finished) => {
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      });
    } else {
      progress.value = withTiming(0, { duration: 300 });
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View style={[styles.progressBarFill, animatedStyle]} />
    </View>
  );
};

/**
 * Individual Card Component with entrance animation
 */
const CardItem: React.FC<{
  item: CarouselItem;
  index: number;
  animationValue: Animated.SharedValue<number>;
  width: number;
  onPress?: () => void;
}> = ({ item, index, animationValue, width, onPress }) => {
  const cardAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.88, 1, 0.88],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [20, 0, 20],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
      opacity,
    };
  });

  return (
    <Pressable onPress={onPress} style={styles.cardPressable}>
      <Animated.View style={[styles.card, { width }, cardAnimatedStyle]}>
        {/* Background Gradient Layer */}
        <View
          style={[
            styles.cardBackground,
            { backgroundColor: item.backgroundColor || '#FDF8F3' },
          ]}
        >
          {/* Left Content */}
          <View style={styles.contentContainer}>
            {/* Tag Pill */}
            <View
              style={[
                styles.tagPill,
                { backgroundColor: `${item.accentColor || '#C17F2E'}15` },
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  { color: item.accentColor || '#C17F2E' },
                ]}
              >
                {item.tag}
              </Text>
            </View>

            {/* Title */}
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>

            {/* Subtitle */}
            <Text style={styles.subtitle} numberOfLines={2}>
              {item.subtitle}
            </Text>
          </View>

          {/* Right Image */}
          <View style={styles.imageContainer}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="cover"
            />
            {/* Subtle overlay for depth */}
            <View style={styles.imageOverlay} />
          </View>

          {/* Decorative accent line */}
          <View
            style={[
              styles.accentLine,
              { backgroundColor: item.accentColor || '#C17F2E' },
            ]}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
};

/**
 * Pagination Dots
 */
const Pagination: React.FC<{
  total: number;
  current: number;
  onDotPress?: (index: number) => void;
}> = ({ total, current, onDotPress }) => {
  return (
    <View style={styles.paginationContainer}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === current;
        return (
          <Pressable
            key={index}
            onPress={() => onDotPress?.(index)}
            style={styles.dotPressable}
          >
            <View
              style={[
                styles.dot,
                isActive && styles.dotActive,
              ]}
            />
            {isActive && <View style={styles.dotInner} />}
          </Pressable>
        );
      })}
    </View>
  );
};

// ─── Main Component ──────────────────────────────────

const PremiumImageCarousel: React.FC<PremiumImageCarouselProps> = ({
  data,
  onCardPress,
  containerStyle,
  showPagination = true,
  showProgressBar = true,
  autoPlay = true,
  loop = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const carouselRef = useRef<any>(null);
  const progressKey = useRef(0);
  const carouselWidth = Math.max(containerWidth, 0);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  // Auto-slide handler
  const handleAutoPlayTick = useCallback(() => {
    if (!carouselRef.current) return;
    const nextIndex = loop
      ? (currentIndex + 1) % data.length
      : Math.min(currentIndex + 1, data.length - 1);

    carouselRef.current.scrollTo({
      index: nextIndex,
      animated: true,
    });
  }, [currentIndex, data.length, loop]);

  // Handle index change
  const handleSnapToItem = useCallback((index: number) => {
    setCurrentIndex(index);
    progressKey.current += 1; // Reset progress bar animation
  }, []);

  // Render each item
  const renderItem = useCallback(
    ({ item, index, animationValue }: any) => (
      <CardItem
        item={item}
        index={index}
        animationValue={animationValue}
        width={carouselWidth}
        onPress={() => onCardPress?.(item, index)}
      />
    ),
    [carouselWidth, onCardPress]
  );

  return (
    <GestureHandlerRootView
      onLayout={handleLayout}
      style={[styles.container, containerStyle]}
    >
      {/* Carousel */}
      {carouselWidth > 0 ? (
        <Carousel
          ref={carouselRef}
          loop={loop}
          width={carouselWidth}
          height={CARD_HEIGHT}
          data={data}
          renderItem={renderItem}
          autoPlay={autoPlay}
          autoPlayInterval={AUTO_PLAY_INTERVAL}
          scrollAnimationDuration={900}
          onSnapToItem={handleSnapToItem}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: 60,
            parallaxAdjacentItemScale: 0.75,
          }}
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
          }}
        />
      ) : (
        <View style={styles.carouselPlaceholder} />
      )}

      {/* Progress Bar */}
      {showProgressBar && (
        <View style={styles.progressBarWrapper}>
          <ProgressBar
            key={progressKey.current}
            active={true}
            duration={AUTO_PLAY_INTERVAL}
          />
        </View>
      )}

      {/* Pagination Dots */}
      {showPagination && (
        <Pagination
          total={data.length}
          current={currentIndex}
          onDotPress={(index) => {
            carouselRef.current?.scrollTo({ index, animated: true });
          }}
        />
      )}
    </GestureHandlerRootView>
  );
};

// ─── Styles ────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  carouselPlaceholder: {
    height: CARD_HEIGHT + 40,
  },

  // Card Styles
  cardPressable: {
    alignSelf: 'center',
  },
  card: {
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    // Shadow for Android
    elevation: 8,
  },
  cardBackground: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(193, 127, 46, 0.12)',
  },

  // Content (Left Side)
  contentContainer: {
    flex: 1.4,
    padding: 20,
    justifyContent: 'center',
  },
  tagPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 28,
    marginBottom: 8,
    fontFamily: 'System', // Replace with your custom font
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666666',
    lineHeight: 19,
  },

  // Image (Right Side)
  imageContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },

  // Decorative Accent
  accentLine: {
    position: 'absolute',
    left: 0,
    top: 20,
    bottom: 20,
    width: 3,
    borderRadius: 2,
    opacity: 0.6,
  },

  // Progress Bar
  progressBarWrapper: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 16,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: 'rgba(193, 127, 46, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#C17F2E',
    borderRadius: 2,
  },

  // Pagination
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 10,
  },
  dotPressable: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(193, 127, 46, 0.25)',
  },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C17F2E',
  },
  dotInner: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
});

export default PremiumImageCarousel;
