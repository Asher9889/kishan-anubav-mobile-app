/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// export const Colors = {
//   light: {
//     text: '#11181C',
//     background: '#fff',
//     tint: tintColorLight,
//     icon: '#687076',
//     tabIconDefault: '#687076',
//     tabIconSelected: tintColorLight,
//   },
//   dark: {
//     text: '#ECEDEE',
//     background: '#151718',
//     tint: tintColorDark,
//     icon: '#9BA1A6',
//     tabIconDefault: '#9BA1A6',
//     tabIconSelected: tintColorDark,
//   },
// };


// export const Colors = {
//   light: {
//     // Backgrounds
//     background: "#F8FBFF",
//     surface: "#FFFFFF",
//     surfaceSecondary: "#EEF6FF",
//     primaryMuted: 'rgba(13,148,136,0.12)',

//     // Primary Brand
//     primary: "#1D4ED8",
//     primaryDark: "#0F2E6E",
//     primaryLight: "#DCEBFF",

//     // Agriculture Accent
//     accent: "#16A34A",
//     accentDark: "#0F7A3D",
//     accentLight: "#DCFCE7",

//     // Text
//     text: "#0B1F3A",
//     textSecondary: "#40516B",
//     textMuted: "#7A8BA3",

//     // Borders
//     border: "#D7E3F4",
//     borderLight: "#EBF2FA",

//     // Cards
//     card: "#FFFFFF",
//     cardSecondary: "#F3F8FF",

//     // States
//     success: "#16A34A",
//     warning: "#D97706",
//     error: "#DC2626",

//     // Inputs
//     input: "#EFF6FF",

//     // Shadows / Glow
//     glow: "rgba(29, 78, 216, 0.14)",

//     // Glass
//     glass: "rgba(255,255,255,0.78)",
//   },

  // dark: {
  //   background: "#06111F",
  //   surface: "#0B1F3A",

  //   primary: "#60A5FA",
  //   accent: "#4ADE80",

  //   text: "#F8FBFF",
  //   textSecondary: "#CBD5E1",

  //   border: "rgba(255,255,255,0.08)",

  //   card: "#0F172A",
  // },
// };

export const Colors = {
  light: {
    // Primary - Deep Teal
    primary: '#0096FF', // Bright Blue
    primaryDark: '#0F766E',
    primaryLight: '#CCFBF1',
    primaryMuted: 'rgba(13,148,136,0.12)',

    // Accent - Warm Amber
    accent: '#F59E0B',
    accentDark: '#D97706',
    accentLight: 'rgba(245,158,11,0.12)',

    // Backgrounds
    background: '#F8FAFB',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F5F9',
    card: '#FFFFFF',
    glass: 'rgba(255,255,255,0.72)',
    input: '#F1F5F9',

    // Text
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',

    // Borders
    border: '#E2E8F0',
    borderLight: 'rgba(0,0,0,0.04)',

    // Status
    success: '#10B981',
    successLight: 'rgba(16,185,129,0.1)',
    warning: '#F59E0B',
    error: '#EF4444',
    errorLight: 'rgba(239,68,68,0.1)',

    // Voice
    voiceGlow: 'rgba(13,148,136,0.3)',
    voicePulse: 'rgba(13,148,136,0.15)',
    voiceRing: 'rgba(13,148,136,0.08)',
  },
    dark: {
    background: "#06111F",
    surface: "#0B1F3A",

    primary: "#60A5FA",
    accent: "#4ADE80",

    text: "#F8FBFF",
    textSecondary: "#CBD5E1",

    border: "rgba(255,255,255,0.08)",

    card: "#0F172A",
  }
};

export const Typography = {
  h1: { fontSize: 28, fontWeight: '800' as const, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '700' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 26 },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 26 },
  caption: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
