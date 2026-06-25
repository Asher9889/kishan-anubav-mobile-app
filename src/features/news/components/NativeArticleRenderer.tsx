// components/news-detail/content-renderers/NativeArticleRenderer.tsx
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NewsDetailData } from '../types/types';
import { SourceFooter } from './SourceFooter';
import { SummaryCard } from './SummaryCard';

interface NativeArticleRendererProps {
  data: NewsDetailData;
  colors: Record<string, string>;
  typography: Record<string, any>;
}

export const NativeArticleRenderer: React.FC<NativeArticleRendererProps> = ({
  data,
  colors,
  typography,
}) => {
  const paragraphs = useMemo(() => {
    const cleanHtml = data.fullDescription
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const sentences = cleanHtml.split(/(?<=[।.!?])\s+/);
    const result: string[] = [];
    let current = '';

    sentences.forEach((sentence, i) => {
      current += sentence + ' ';
      if (current.length > 120 || i === sentences.length - 1) {
        result.push(current.trim());
        current = '';
      }
    });

    return result.filter((p) => p.length > 10);
  }, [data.fullDescription]);

  return (
    <View style={styles.container}>
      <SummaryCard
        summary={data.shortSummary}
        primaryColor={colors.primary}
        onPrimaryContainerColor={colors.onPrimaryContainer}
        primaryMuted={colors.primaryMuted}
      />

      {paragraphs.map((para, index) => (
        <Text
          key={index}
          style={[
            styles.paragraph,
            {
              color: colors.textSecondary,
              fontSize: typography.body.fontSize,
              lineHeight: 28,
            },
          ]}
        >
          {para}
        </Text>
      ))}

      <SourceFooter
        source={data.source}
        publishDate={data.publishDate}
        primaryColor={colors.primary}
        textColor={colors.text}
        textMutedColor={colors.textMuted}
        borderColor={colors.borderLight}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  paragraph: {
    marginBottom: 18,
    textAlign: 'justify',
  },
});