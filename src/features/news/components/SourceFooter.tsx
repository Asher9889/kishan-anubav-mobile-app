// components/news-detail/cards/SourceFooter.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SourceFooterProps {
  source: string;
  publishDate: string;
  primaryColor: string;
  textColor: string;
  textMutedColor: string;
  borderColor: string;
}

export const SourceFooter: React.FC<SourceFooterProps> = ({
  source,
  publishDate,
  primaryColor,
  textColor,
  textMutedColor,
  borderColor,
}) => (
  <View style={[styles.container, { borderTopColor: borderColor }]}>
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: primaryColor }]} />
      <Text style={[styles.label, { color: textMutedColor }]}>Source</Text>
    </View>
    <Text style={[styles.source, { color: textColor }]}>{source}</Text>
    <Text style={[styles.date, { color: textMutedColor }]}>
      Published on {publishDate}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingTop: 24,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  source: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
  },
});