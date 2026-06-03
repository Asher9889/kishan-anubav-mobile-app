import useTheme from '@/hooks/useTheme'; // Your theme hook
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  Animated as RNAnimated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ─── Types ─────────────────────────────────────────────

interface PdfViewerParams {
  pdfUrl?: string;
  title?: string;
}

// ─── Loading Component ───────────────────────────────

const LoadingView: React.FC<{ colors: any }> = ({ colors }) => (
  <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
    <View style={styles.loaderWrapper}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loaderText, { color: colors.textMuted }]}>
        Loading document...
      </Text>
    </View>
  </View>
);

// ─── Error Component ───────────────────────────────────

const ErrorView: React.FC<{
  message: string;
  onRetry: () => void;
  colors: any;
}> = ({ message, onRetry, colors }) => (
  <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
    <View style={[styles.errorCard, { backgroundColor: colors.card }]}>
      <Text style={styles.errorIcon}>📄</Text>
      <Text style={[styles.errorTitle, { color: colors.text }]}>
        Unable to Load PDF
      </Text>
      <Text style={[styles.errorMessage, { color: colors.textMuted }]}>
        {message}
      </Text>
      <Pressable
        onPress={onRetry}
        style={[styles.retryButton, { backgroundColor: colors.primary }]}
      >
        <Text style={[styles.retryText, { color: colors.onPrimary }]}>
          Try Again
        </Text>
      </Pressable>
    </View>
  </View>
);

// ─── Header Component ──────────────────────────────────

const PdfHeader: React.FC<{
  title: string;
  onBack: () => void;
  onShare: () => void;
  colors: any;
}> = ({ title, onBack, onShare, colors }) => (
  <SafeAreaView style={[styles.headerSafeArea, { backgroundColor: colors.background }]}>
    <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
      <Pressable
        onPress={onBack}
        style={[styles.headerButton, { backgroundColor: colors.primaryMuted }]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[styles.headerIcon, { color: colors.primary }]}>←</Text>
      </Pressable>

      <Text
        style={[styles.headerTitle, { color: colors.text }]}
        numberOfLines={1}
      >
        {title || 'Document'}
      </Text>

      <Pressable
        onPress={onShare}
        style={[styles.headerButton, { backgroundColor: colors.primaryMuted }]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[styles.headerIcon, { color: colors.primary }]}>↗</Text>
      </Pressable>
    </View>
  </SafeAreaView>
);

// ─── Progress Bar Component ──────────────────────────

const ProgressBar: React.FC<{
  progress: number;
  colors: any;
}> = ({ progress, colors }) => (
  <View style={[styles.progressContainer, { backgroundColor: colors.surfaceContainerLow }]}>
    <RNAnimated.View
      style={[
        styles.progressFill,
        {
          width: `${progress * 100}%`,
          backgroundColor: colors.primary,
        },
      ]}
    />
  </View>
);

// ─── Main Screen Component ─────────────────────────────

export default function NewsPdfViewerScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { pdfUrl, title } = params as PdfViewerParams;
  const webViewRef = useRef<WebView>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);

  // ─── URL Validation ────────────────────────────────

  const validateUrl = useCallback((url: string | undefined): string | null => {
    if (!url) return null;
    if (typeof url !== 'string') return null;

    // Trim and clean
    let cleanUrl = url.trim();

    // Check if it's a valid URL
    const urlPattern = /^(https?:\/\/)/i;
    if (!urlPattern.test(cleanUrl)) {
      // Try adding https if missing
      cleanUrl = `https://${cleanUrl}`;
    }

    // Validate URL structure
    try {
      new URL(cleanUrl);
      return cleanUrl;
    } catch {
      return null;
    }
  }, []);

  const validatedUrl = validateUrl(pdfUrl);

  // ─── Handlers ──────────────────────────────────────

  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setError(null);
    setProgress(0);
  }, []);

  const handleLoadProgress = useCallback((event: any) => {
    setProgress(event.nativeEvent.progress);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setLoading(false);
    setProgress(1);
  }, []);

  const handleError = useCallback((syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error:', nativeEvent);
    setLoading(false);
    setError(nativeEvent.description || 'Failed to load the document');
  }, []);

  const handleHttpError = useCallback((syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView HTTP error:', nativeEvent);
    setLoading(false);
    setError(`Server error: ${nativeEvent.statusCode}`);
  }, []);

  const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
  }, []);

  const handleBack = useCallback(() => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    } else {
      router.back();
    }
  }, [canGoBack, router]);

  const handleShare = useCallback(async () => {
    if (!validatedUrl) return;
    try {
      const { Share } = await import('react-native');
      await Share.share({
        message: `Check out this document: ${validatedUrl}`,
        title: title || 'Document',
        url: validatedUrl,
      });
    } catch (err) {
      console.log('Share cancelled or failed');
    }
  }, [validatedUrl, title]);

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    setProgress(0);
    webViewRef.current?.reload();
  }, []);

  // ─── Render ────────────────────────────────────────

  // Invalid URL state
  if (!validatedUrl) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <PdfHeader
          title="Error"
          onBack={() => router.back()}
          onShare={() => {}}
          colors={colors}
        />
        <ErrorView
          message="Invalid or missing PDF URL. Please check the link and try again."
          onRetry={() => router.back()}
          colors={colors}
        />
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <PdfHeader
          title={title || 'Document'}
          onBack={handleBack}
          onShare={handleShare}
          colors={colors}
        />
        <ErrorView
          message={error}
          onRetry={handleRetry}
          colors={colors}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <PdfHeader
        title={title || 'Document'}
        onBack={handleBack}
        onShare={handleShare}
        colors={colors}
      />

      {/* Progress Bar */}
      {loading && progress < 1 && (
        <ProgressBar progress={progress} colors={colors} />
      )}

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: validatedUrl }}
        style={[styles.webView, { backgroundColor: colors.background }]}
        
        // Loading states
        onLoadStart={handleLoadStart}
        onLoadProgress={handleLoadProgress}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onHttpError={handleHttpError}
        onNavigationStateChange={handleNavigationStateChange}
        
        // UI Config
        startInLoadingState={true}
        renderLoading={() => <LoadingView colors={colors} />}
        
        // Security
        originWhitelist={['https://*', 'http://*']}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={true}
        
        // Performance
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={true}
        
        // PDF specific
        // For Google Docs viewer fallback (uncomment if needed):
        // source={{ uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(validatedUrl)}` }}
      />

      {/* Overlay Loading (optional, for smoother UX) */}
      {loading && (
        <View style={[styles.loadingOverlay, { backgroundColor: colors.background }]}>
          <LoadingView colors={colors} />
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  // Header
  headerSafeArea: {
    // SafeAreaView handles insets automatically
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
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

  // WebView
  webView: {
    flex: 1,
  },

  // Progress Bar
  progressContainer: {
    height: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },

  // Loading
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderWrapper: {
    alignItems: 'center',
    gap: 16,
  },
  loaderText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  // Error
  errorCard: {
    width: SCREEN_W * 0.8,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '700',
  },
});