// components/news-detail/cards/SummaryCard.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SummaryCardProps {
  summary: string;
  primaryColor: string;
  onPrimaryContainerColor: string;
  primaryMuted: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  summary,
  primaryColor,
  onPrimaryContainerColor,
  primaryMuted,
}) => (
  <View style={[styles.container, { backgroundColor: primaryMuted, borderLeftColor: primaryColor }]}>
    <Text style={styles.icon}>📰</Text>
    <Text style={[styles.text, { color: onPrimaryContainerColor }]}>
      {summary}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    marginBottom: 24,
    gap: 12,
  },
  icon: {
    fontSize: 20,
    marginTop: 2,
  },
  text: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
});