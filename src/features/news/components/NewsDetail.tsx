// components/NewsDetailScreen.tsx
import useTheme from '@/hooks/useTheme';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Linking,
  Platform,
  Pressable,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { WebView } from 'react-native-webview';
// ─── Types ─────────────────────────────────────────────

export interface NewsDetailData {
  _id: { $oid: string };
  id: string;
  category: string;
  createdAt: string;
  fullDescription: string;
  htmlDescription: string;
  pdfUrl: string;
  publishDate: string;
  shortSummary: string;
  source: string;
  title: string;
  updatedAt: string;
  tag: string;
}

interface NewsDetailScreenProps {
  newsId: string;
  onBackPress: () => void;
  fetchNewsById: (id: string) => Promise<NewsDetailData>;
  onShare?: (data: NewsDetailData) => void;
  onPdfOpen?: (url: string) => void;
}

// ─── Mock useTheme hook (replace with your actual hook) ─
// This matches your provided Colors schema exactly

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const HERO_HEIGHT = 320;
const HEADER_COLLAPSE_THRESHOLD = 200;

// ─── Sub-Components ──────────────────────────────────

/**
 * Skeleton loader for loading state
 */
const NewsDetailSkeleton: React.FC<{ colors: any }> = ({ colors }) => (
  <View style={[styles.skeletonContainer, { backgroundColor: colors.background }]}>
    <View style={[styles.skeletonHero, { backgroundColor: colors.surfaceContainer }]} />
    <View style={styles.skeletonContent}>
      <View style={[styles.skeletonLine, { width: '40%', backgroundColor: colors.surfaceContainer }]} />
      <View style={[styles.skeletonLine, { width: '80%', height: 28, backgroundColor: colors.surfaceContainer }]} />
      <View style={[styles.skeletonLine, { width: '100%', height: 80, backgroundColor: colors.surfaceContainer }]} />
      <View style={[styles.skeletonLine, { width: '90%', backgroundColor: colors.surfaceContainer }]} />
      <View style={[styles.skeletonLine, { width: '95%', backgroundColor: colors.surfaceContainer }]} />
    </View>
  </View>
);

/**
 * Animated Header that transforms on scroll
 */
const AnimatedHeader: React.FC<{
  scrollY: Animated.SharedValue<number>;
  title: string;
  onBackPress: () => void;
  onSharePress: () => void;
  colors: any;
}> = ({ scrollY, title, onBackPress, onSharePress, colors }) => {
  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_COLLAPSE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_COLLAPSE_THRESHOLD],
      [-20, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
      backgroundColor: colors.glass,
    };
  });

  const blurStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_COLLAPSE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  return (
    <Animated.View style={[styles.headerContainer, headerStyle]}>
      <View style={[styles.headerBlur, { backgroundColor: colors.background }]}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.glass }, blurStyle]} />
      </View>
      <View style={styles.headerContent}>
        <Pressable
          onPress={onBackPress}
          style={[styles.headerButton, { backgroundColor: colors.primaryMuted }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.headerIcon, { color: colors.primary }]}>←</Text>
        </Pressable>
        <Animated.Text
          numberOfLines={1}
          style={[styles.headerTitle, { color: colors.text }]}
        >
          {title}
        </Animated.Text>
        <Pressable
          onPress={onSharePress}
          style={[styles.headerButton, { backgroundColor: colors.primaryMuted }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.headerIcon, { color: colors.primary }]}>↗</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

/**
 * Floating Action Bar at bottom
 */
const FloatingActionBar: React.FC<{
  data: NewsDetailData;
  colors: any;
  onPdfOpen?: (url: string) => void;
  onShare?: (data: NewsDetailData) => void;
}> = ({ data, colors, onPdfOpen, onShare }) => {
  const handleShare = useCallback(async () => {
    if (onShare) {
      onShare(data);
      return;
    }
    try {
      await Share.share({
        message: `${data.title}\n\n${data.shortSummary}\n\nSource: ${data.source}`,
        title: data.title,
      });
    } catch (e) {
      console.error(e);
    }
  }, [data, onShare]);

  const handlePdfOpen = useCallback(() => {
    if (onPdfOpen) {
      onPdfOpen(data.pdfUrl);
    } else {
      Linking.openURL(data.pdfUrl).catch(() => {});
    }
  }, [data.pdfUrl, onPdfOpen]);

  return (
    <View style={[styles.floatingBar, { backgroundColor: colors.card, borderTopColor: colors.borderLight }]}>
      <Pressable
        onPress={handlePdfOpen}
        style={[styles.floatingButton, { backgroundColor: colors.primaryMuted }]}
      >
        <Text style={[styles.floatingButtonIcon, { color: colors.primary }]}>📄</Text>
        <Text style={[styles.floatingButtonText, { color: colors.primary }]}>PDF</Text>
      </Pressable>
      <Pressable
        onPress={handleShare}
        style={[styles.floatingButtonPrimary, { backgroundColor: colors.primary }]}
      >
        <Text style={[styles.floatingButtonText, { color: colors.onPrimary }]}>Share News</Text>
      </Pressable>
    </View>
  );
};

/**
 * HTML Content Renderer with custom styling
 */
const HtmlContent: React.FC<{
  html: string;
  colors: any;
  typography: any;
}> = ({ html, colors, typography }) => {
  // Inject custom CSS to match theme
  const injectedCSS = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, sans-serif;
        background-color: ${colors.background};
        color: ${colors.text};
        line-height: 1.75;
        font-size: 17px;
        padding: 0;
      }
      
      article {
        padding: 0;
      }
      
      header h1 {
        font-size: 24px;
        font-weight: 800;
        color: ${colors.text};
        line-height: 1.3;
        margin-bottom: 16px;
        display: none; /* We show title natively */
      }
      
      section {
        padding: 0 20px;
      }
      
      p {
        margin-bottom: 16px;
        color: ${colors.textSecondary};
        line-height: 1.8;
        font-size: 16px;
        text-align: justify;
      }
      
      p strong {
        color: ${colors.text};
        font-weight: 700;
      }
      
      footer {
        margin-top: 32px;
        padding: 16px 20px;
        border-top: 1px solid ${colors.borderLight};
      }
      
      footer small {
        color: ${colors.textMuted};
        font-size: 12px;
        font-weight: 500;
      }
      
      /* Highlight key stats */
      p:has(strong) {
        background: ${colors.primaryMuted};
        padding: 16px;
        border-radius: 12px;
        border-left: 3px solid ${colors.primary};
        margin-bottom: 20px;
      }
      
      /* Smooth text selection */
      ::selection {
        background: ${colors.primaryLight};
        color: ${colors.primaryDark};
      }
    </style>
  `;

  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        ${injectedCSS}
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: fullHtml }}
      style={[styles.webView, { backgroundColor: colors.background }]}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={false}
      textZoom={100}
    />
  );
};

/**
 * Native-rendered article content (fallback / premium option)
 */
const NativeArticleContent: React.FC<{
  data: NewsDetailData;
  colors: any;
  typography: any;
}> = ({ data, colors, typography }) => {
  // Parse HTML content to extract paragraphs for native rendering
  const extractParagraphs = (html: string): string[] => {
    const cleanHtml = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    // Split by common sentence endings for better paragraph grouping
    const sentences = cleanHtml.split(/(?<=[।.!?])\s+/);
    const paragraphs: string[] = [];
    let currentPara = '';
    
    sentences.forEach((sentence, i) => {
      currentPara += sentence + ' ';
      if (currentPara.length > 120 || i === sentences.length - 1) {
        paragraphs.push(currentPara.trim());
        currentPara = '';
      }
    });
    
    return paragraphs.filter(p => p.length > 10);
  };

  const paragraphs = extractParagraphs(data.fullDescription);

  return (
    <View style={styles.nativeContent}>
      {/* Summary Card */}
      <View style={[styles.summaryCard, { backgroundColor: colors.primaryMuted, borderLeftColor: colors.primary }]}>
        <Text style={[styles.summaryIcon, { color: colors.primary }]}>📰</Text>
        <Text style={[styles.summaryText, { color: colors.onPrimaryContainer, ...typography.bodyMedium }]}>
          {data.shortSummary}
        </Text>
      </View>

      {/* Article Body */}
      {paragraphs.map((para, index) => (
        <Animated.Text
          key={index}
          style={[
            styles.paragraph,
            {
              color: colors.textSecondary,
              ...typography.body,
              lineHeight: 28,
            },
          ]}
        >
          {para}
        </Animated.Text>
      ))}

      {/* Source Footer */}
      <View style={[styles.sourceFooter, { borderTopColor: colors.borderLight }]}>
        <View style={styles.sourceRow}>
          <View style={[styles.sourceDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.sourceLabel, { color: colors.textMuted }]}>Source</Text>
        </View>
        <Text style={[styles.sourceValue, { color: colors.text }]}>{data.source}</Text>
        <Text style={[styles.sourceDate, { color: colors.textMuted }]}>
          Published on {data.publishDate}
        </Text>
      </View>
    </View>
  );
};

// ─── Main Component ──────────────────────────────────

const NewsDetail: React.FC<NewsDetailScreenProps> = ({
  newsId,
  onBackPress,
  fetchNewsById,
  onShare,
  onPdfOpen,
}) => {
  const { colors, typography, spacing, radius, isDark } = useTheme();
  const [data, setData] = useState<NewsDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useNativeRender, setUseNativeRender] = useState(true);

  const scrollY = useSharedValue(0);
  const heroScale = useSharedValue(1);
  const contentOpacity = useSharedValue(0);

  // Fetch data on mount
  useEffect(() => {
    let mounted = true;
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchNewsById(newsId);
        if (mounted) {
          setData(result);
          // Animate content in
          contentOpacity.value = withTiming(1, { duration: 600 });
        }
      } catch (err) {
        if (mounted) setError('Failed to load news. Please try again.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadNews();
    return () => { mounted = false; };
  }, [newsId, fetchNewsById]);

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      // Parallax effect for hero
      const offset = event.contentOffset.y;
      if (offset <= 0) {
        heroScale.value = 1 + Math.abs(offset) / 400;
      } else {
        heroScale.value = withTiming(1, { duration: 100 });
      }
    },
  });

  // Hero image parallax style
  const heroAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heroScale.value }],
  }));

  // Content fade-in style
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <NewsDetailSkeleton colors={colors} />
      </View>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <Text style={[styles.errorText, { color: colors.error }]}>{error || 'Something went wrong'}</Text>
        <Pressable
          onPress={onBackPress}
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
        >
          <Text style={{ color: colors.onPrimary, fontWeight: '700' }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Animated Header */}
      <AnimatedHeader
        scrollY={scrollY}
        title={data.title}
        onBackPress={onBackPress}
        onSharePress={() => onShare?.(data)}
        colors={colors}
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section with Parallax Image */}
        <View style={[styles.heroContainer, { height: HERO_HEIGHT }]}>
          <Animated.Image
            source={{ uri: `https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80` }}
            style={[StyleSheet.absoluteFill, styles.heroImage, heroAnimatedStyle]}
            resizeMode="cover"
          />
          {/* Gradient Overlay */}
          <View style={[StyleSheet.absoluteFill, styles.heroOverlay, {
            backgroundColor: isDark
              ? 'rgba(6, 17, 31, 0.7)'
              : 'rgba(27, 28, 25, 0.35)'
          }]} />
          
          {/* Hero Content */}
          <View style={styles.heroContent}>
            <View style={[styles.tagBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.tagBadgeText, { color: colors.onPrimary }]}>{data.tag}</Text>
            </View>
            <Text style={[styles.heroTitle, { color: '#FFFFFF' }]} numberOfLines={3}>
              {data.title}
            </Text>
            <View style={styles.heroMeta}>
              <View style={[styles.sourcePill, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Text style={styles.sourcePillText}>{data.source}</Text>
              </View>
              <Text style={styles.dateText}>{data.publishDate}</Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <Animated.View style={[styles.contentContainer, { backgroundColor: colors.background }, contentAnimatedStyle]}>
          {/* Toggle between Native and WebView rendering */}
          <View style={[styles.renderToggle, { backgroundColor: colors.surfaceContainerLow }]}>
            <Pressable
              onPress={() => setUseNativeRender(true)}
              style={[
                styles.toggleButton,
                useNativeRender && { backgroundColor: colors.primary }
              ]}
            >
              <Text style={[
                styles.toggleText,
                { color: useNativeRender ? colors.onPrimary : colors.textMuted }
              ]}>Clean Read</Text>
            </Pressable>
            <Pressable
              onPress={() => setUseNativeRender(false)}
              style={[
                styles.toggleButton,
                !useNativeRender && { backgroundColor: colors.primary }
              ]}
            >
              <Text style={[
                styles.toggleText,
                { color: !useNativeRender ? colors.onPrimary : colors.textMuted }
              ]}>Original</Text>
            </Pressable>
          </View>

          {useNativeRender ? (
            <NativeArticleContent data={data} colors={colors} typography={typography} />
          ) : (
            <HtmlContent html={data.htmlDescription} colors={colors} typography={typography} />
          )}

          {/* Extra spacing for floating bar */}
          <View style={{ height: 100 }} />
        </Animated.View>
      </Animated.ScrollView>

      {/* Floating Action Bar */}
      <FloatingActionBar
        data={data}
        colors={colors}
        onPdfOpen={onPdfOpen}
        onShare={onShare}
      />
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // ─── Header ──────────────────────────────────────
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 24,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 16,
    textAlign: 'center',
  },

  // ─── Hero ────────────────────────────────────────
  heroContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    // Dynamic gradient overlay
  },
  heroContent: {
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
  },
  tagBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 12,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sourcePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sourcePillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '500',
  },

  // ─── Content ─────────────────────────────────────
  contentContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    paddingTop: 8,
    minHeight: SCREEN_H - 200,
  },
  renderToggle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    padding: 4,
    borderRadius: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // ─── Native Content ──────────────────────────────
  nativeContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    marginBottom: 24,
    gap: 12,
  },
  summaryIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  summaryText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  paragraph: {
    marginBottom: 18,
    textAlign: 'justify',
  },
  sourceFooter: {
    marginTop: 32,
    paddingTop: 24,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sourceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sourceLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sourceValue: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  sourceDate: {
    fontSize: 13,
    fontWeight: '500',
  },

  // ─── WebView ─────────────────────────────────────
  webView: {
    height: SCREEN_H * 1.5, // Approximate, adjust as needed
    width: '100%',
  },

  // ─── Floating Bar ────────────────────────────────
  floatingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    gap: 12,
  },
  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  floatingButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  floatingButtonIcon: {
    fontSize: 16,
  },
  floatingButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // ─── Skeleton ────────────────────────────────────
  skeletonContainer: {
    flex: 1,
  },
  skeletonHero: {
    width: '100%',
    height: HERO_HEIGHT,
  },
  skeletonContent: {
    padding: 20,
    gap: 16,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  skeletonLine: {
    height: 16,
    borderRadius: 8,
  },

  // ─── Error ───────────────────────────────────────
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
});

export default NewsDetail;