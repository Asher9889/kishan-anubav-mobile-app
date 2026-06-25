// components/news-detail/loaders/NewsDetailSkeleton.tsx
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
const HERO_HEIGHT = 320;

interface NewsDetailSkeletonProps {
  colors: Record<string, string>;
}

export const NewsDetailSkeleton: React.FC<NewsDetailSkeletonProps> = ({ colors }) => (
  <View style={[styles.container, { backgroundColor: colors.background }]}>
    <View style={[styles.hero, { backgroundColor: colors.surfaceContainer }]} />
    <View style={styles.content}>
      <View style={[styles.line, { width: '40%', backgroundColor: colors.surfaceContainer }]} />
      <View style={[styles.line, { width: '80%', height: 28, backgroundColor: colors.surfaceContainer }]} />
      <View style={[styles.line, { width: '100%', height: 80, backgroundColor: colors.surfaceContainer }]} />
      <View style={[styles.line, { width: '90%', backgroundColor: colors.surfaceContainer }]} />
      <View style={[styles.line, { width: '95%', backgroundColor: colors.surfaceContainer }]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { width: '100%', height: HERO_HEIGHT },
  content: {
    padding: 20,
    gap: 16,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  line: { height: 16, borderRadius: 8 },
});