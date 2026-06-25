// components/news-detail/content-renderers/HtmlArticleRenderer.tsx
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const { height: SCREEN_H } = Dimensions.get('window');

interface HtmlArticleRendererProps {
  html: string;
  colors: Record<string, string>;
}

export const HtmlArticleRenderer: React.FC<HtmlArticleRendererProps> = ({
  html,
  colors,
}) => {

  const fullHtml = useMemo(() => {
    const css = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Noto Sans Devanagari', sans-serif;
          background-color: ${colors.background};
          color: ${colors.text};
          line-height: 1.75;
          font-size: 17px;
          padding: 0 20px;
        }
        header h1 { display: none; }
        p {
          margin-bottom: 16px;
          color: ${colors.textSecondary};
          line-height: 1.8;
          font-size: 16px;
          text-align: justify;
        }
        p strong { color: ${colors.text}; font-weight: 700; }
        footer {
          margin-top: 32px;
          padding: 16px 0;
          border-top: 1px solid ${colors.borderLight};
        }
        footer small { color: ${colors.textMuted}; font-size: 12px; font-weight: 500; }
        p:has(strong) {
          background: ${colors.primaryMuted};
          padding: 16px;
          border-radius: 12px;
          border-left: 3px solid ${colors.primary};
          margin-bottom: 20px;
        }
      </style>
    `;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          ${css}
        </head>
        <body>${html}</body>
      </html>
    `;
  }, [html, colors]);

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

const styles = StyleSheet.create({
  webView: {
    height: SCREEN_H * 1.5,
    width: '100%',
  },
});