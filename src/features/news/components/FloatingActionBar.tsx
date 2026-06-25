// components/news-detail/controls/FloatingActionBar.tsx
import React, { useCallback } from 'react';
import { Linking, Platform, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { NewsDetailData } from '../types/types';

interface FloatingActionBarProps {
  data: NewsDetailData;
  primaryColor: string;
  onPrimaryColor: string;
  primaryMuted: string;
  cardColor: string;
  borderColor: string;
  onPdfOpen?: (url: string) => void;
  onShare?: (data: NewsDetailData) => void;
}

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
  data,
  primaryColor,
  onPrimaryColor,
  primaryMuted,
  cardColor,
  borderColor,
  onPdfOpen,
  onShare,
}) => {
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
    <View style={[styles.container, { backgroundColor: cardColor, borderTopColor: borderColor }]}>
      <Pressable
        onPress={handlePdfOpen}
        style={[styles.pdfButton, { backgroundColor: primaryMuted }]}
      >
        <Text style={[styles.pdfIcon, { color: primaryColor }]}>📄</Text>
        <Text style={[styles.pdfText, { color: primaryColor }]}>PDF</Text>
      </Pressable>
      <Pressable
        onPress={handleShare}
        style={[styles.shareButton, { backgroundColor: primaryColor }]}
      >
        <Text style={[styles.shareText, { color: onPrimaryColor }]}>Share News</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  pdfIcon: {
    fontSize: 16,
  },
  pdfText: {
    fontSize: 14,
    fontWeight: '700',
  },
  shareButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  shareText: {
    fontSize: 14,
    fontWeight: '700',
  },
});