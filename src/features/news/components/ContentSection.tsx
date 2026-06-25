// components/news-detail/sections/ContentSection.tsx
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { HtmlArticleRenderer } from '../components/HtmlArticleRenderer';
import { RenderModeToggle } from '../components/RenderModeToggle';
import { NewsDetailData, RenderMode } from '../types/types';
import { NativeArticleRenderer } from './NativeArticleRenderer';

const { height: SCREEN_H } = Dimensions.get('window');

interface ContentSectionProps {
  data: NewsDetailData;
  renderMode: RenderMode;
  onRenderModeChange: (mode: RenderMode) => void;
  colors: Record<string, string>;
  typography: Record<string, any>;
  contentOpacity: Animated.SharedValue<number>;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  data,
  renderMode,
  onRenderModeChange,
  colors,
  typography,
  contentOpacity,
}) => {
  const animatedStyle = {opacity: contentOpacity};
  console.log('Rendering ContentSection with data:', Object.keys(data));

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.background },
        animatedStyle,
      ]}
    >
      <RenderModeToggle
        mode={renderMode}
        onChange={onRenderModeChange}
        activeColor={colors.primary}
        activeTextColor={colors.onPrimary}
        inactiveTextColor={colors.textMuted}
        backgroundColor={colors.surfaceContainerLow}
      />

      {renderMode === 'clean' ? (
        <NativeArticleRenderer data={data} colors={colors} typography={typography} />
      ) : (
        <HtmlArticleRenderer html={data.htmlDescription} colors={colors} />
      )}

      <View style={{ height: 100 }} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    paddingTop: 8,
    minHeight: SCREEN_H - 200,
  },
});