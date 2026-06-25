// components/news-detail/sections/HeroSection.tsx
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ParallaxImage } from '../animations/ParallaxImage';

const { width: SCREEN_W } = Dimensions.get('window');
const HERO_HEIGHT = 320;

interface HeroSectionProps {
  title: string;
  tag: string;
  source: string;
  publishDate: string;
  imageUrl: string;
  scrollY: number;
  isDark: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  tag,
  source,
  publishDate,
  imageUrl,
  scrollY,
  isDark,
}) => (
  <View style={[styles.container, { height: HERO_HEIGHT }]}>
    <ParallaxImage
      source={{ uri: imageUrl }}
      scrollY={scrollY}
      height={HERO_HEIGHT}
    />
    <View
      style={[
        StyleSheet.absoluteFill,
        styles.overlay,
        {
          backgroundColor: isDark
            ? 'rgba(6, 17, 31, 0.7)'
            : 'rgba(27, 28, 25, 0.35)',
        },
      ]}
    />
    <View style={styles.content}>
      <View style={styles.tagBadge}>
        <Text style={styles.tagText}>{tag}</Text>
      </View>
      <Text style={styles.title} numberOfLines={3}>
        {title}
      </Text>
      <View style={styles.meta}>
        <View style={styles.sourcePill}>
          <Text style={styles.sourceText}>{source}</Text>
        </View>
        <Text style={styles.date}>{publishDate}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  overlay: {
    // Dynamic based on theme
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 32,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    backgroundColor: '#8F4E00',
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sourcePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sourceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '500',
  },
});