import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Plus } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

const STORY_HIGHLIGHTS = [
  { id: '1', title: 'New', icon: 'plus' as const },
  { id: '2', title: 'Travel', uri: 'https://picsum.photos/100/100?random=10' },
  { id: '3', title: 'Food', uri: 'https://picsum.photos/100/100?random=11' },
  { id: '4', title: 'Work', uri: 'https://picsum.photos/100/100?random=12' },
  { id: '5', title: 'Friends', uri: 'https://picsum.photos/100/100?random=13' },
];

const StoryHighlights = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.highlightsContainer}
    >
      {STORY_HIGHLIGHTS.map((highlight) => (
        <Pressable key={highlight.id} style={styles.highlightItem} accessibilityRole="button">
          <View style={styles.highlightRing}>
            {highlight.icon === 'plus' ? (
              <View style={styles.highlightAdd}>
                <Plus size={28} color={theme.textSecondary} />
              </View>
            ) : (
              <Image
                source={{ uri: highlight.uri }}
                style={styles.highlightImage}
                contentFit="cover"
              />
            )}
          </View>
          <Text style={styles.highlightTitle}>{highlight.title}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    highlightsContainer: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      gap: Spacing.lg,
    },
    highlightItem: {
      alignItems: 'center',
      gap: 6,
    },
    highlightRing: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 1,
      borderColor: theme.borderLight,
      padding: 2,
    },
    highlightImage: {
      width: '100%',
      height: '100%',
      borderRadius: 30,
    },
    highlightAdd: {
      width: '100%',
      height: '100%',
      borderRadius: 30,
      backgroundColor: theme.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    highlightTitle: {
      color: theme.text,
      fontSize: Typography.small.fontSize,
      fontWeight: '400',
    },
  });

export default StoryHighlights;
