// components/news-detail/NewsDetailScreen.tsx
import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { AnimatedHeader } from '../animations/AnimatedHeader';
import { ContentSection } from '../components/ContentSection';
import { ErrorState } from '../components/ErrorState';
import { FloatingActionBar } from '../components/FloatingActionBar';
import { HeroSection } from '../components/HeroSection';
import { NewsDetailSkeleton } from '../components/NewsDetailSkeleton';
import { useNewsDetail } from '../hooks/useNewsDetail';
import { NewsDetailScreenProps, RenderMode } from '../types/types';
// Replace this with your actual useTheme hook
const useTheme = () => {
  // Mock — replace with your actual hook
  return {
    colors: {
      background: '#FBF9F4',
      surfaceContainerLow: '#F5F3EE',
      primary: '#8F4E00',
      primaryDark: '#693800',
      primaryMuted: 'rgba(143, 78, 0, 0.12)',
      onPrimary: '#FFFFFF',
      onPrimaryContainer: '#693800',
      text: '#1B1C19',
      textSecondary: '#554336',
      textMuted: '#887364',
      borderLight: '#E4E2DD',
      card: '#FFFFFF',
      glass: 'rgba(255,255,255,0.72)',
      error: '#BA1A1A',
    },
    typography: {
      body: { fontSize: 16, fontWeight: '400', lineHeight: 26 },
    },
    isDark: false,
  };
};

const NewsDetailScreen: React.FC<NewsDetailScreenProps> = ({
  newsId,
  onBackPress,
  onShare,
  onPdfOpen,
}) => {
  const { colors, typography, isDark } = useTheme();
  const { data, loading, error, refetch } = useNewsDetail(newsId);
  const [renderMode, setRenderMode] = useState<RenderMode>('clean');

  const scrollY = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animate content in when data loads
  React.useEffect(() => {
    if (data && !loading) {
      contentOpacity.value = 1;
    }
  }, [data, loading]);

  const handleShare = useCallback(() => {
    if (data) onShare?.(data);
  }, [data, onShare]);

  if (loading) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <NewsDetailSkeleton colors={colors} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <ErrorState
          message={error || 'Something went wrong'}
          onRetry={refetch}
          primaryColor={colors.primary}
          onPrimaryColor={colors.onPrimary}
          textColor={colors.text}
        />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <AnimatedHeader
        scrollY={scrollY}
        title={data.title}
        onBackPress={onBackPress}
        onSharePress={handleShare}
        backgroundColor={colors.background}
        glassColor={colors.glass}
        textColor={colors.text}
        primaryColor={colors.primary}
        primaryMuted={colors.primaryMuted}
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroSection
          title={data.title}
          tag={data.tag}
          source={data.source}
          publishDate={data.publishDate}
          imageUrl="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
          scrollY={scrollY}
          isDark={isDark}
        />

        <ContentSection
          data={data}
          renderMode={renderMode}
          onRenderModeChange={setRenderMode}
          colors={colors}
          typography={typography}
          contentOpacity={contentOpacity}
        />
      </Animated.ScrollView>

      <FloatingActionBar
        data={data}
        primaryColor={colors.primary}
        onPrimaryColor={colors.onPrimary}
        primaryMuted={colors.primaryMuted}
        cardColor={colors.card}
        borderColor={colors.borderLight}
        onPdfOpen={onPdfOpen}
        onShare={onShare}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default NewsDetailScreen;