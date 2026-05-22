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


export const Colors = {
  light: {
    // Backgrounds
    background: "#F8FBFF",
    surface: "#FFFFFF",
    surfaceSecondary: "#EEF6FF",

    // Primary Brand
    primary: "#1D4ED8",
    primaryDark: "#0F2E6E",
    primaryLight: "#DCEBFF",

    // Agriculture Accent
    accent: "#16A34A",
    accentDark: "#0F7A3D",
    accentLight: "#DCFCE7",

    // Text
    text: "#0B1F3A",
    textSecondary: "#40516B",
    textMuted: "#7A8BA3",

    // Borders
    border: "#D7E3F4",
    borderLight: "#EBF2FA",

    // Cards
    card: "#FFFFFF",
    cardSecondary: "#F3F8FF",

    // States
    success: "#16A34A",
    warning: "#D97706",
    error: "#DC2626",

    // Inputs
    input: "#EFF6FF",

    // Shadows / Glow
    glow: "rgba(29, 78, 216, 0.14)",

    // Glass
    glass: "rgba(255,255,255,0.78)",
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
  },
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
