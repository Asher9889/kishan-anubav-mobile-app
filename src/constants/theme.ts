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
    background: '#FBF9F4',
    surface: '#FBF9F4',
    surfaceBright: '#FBF9F4',
    surfaceDim: '#DBDAD5',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#F5F3EE',
    surfaceContainer: '#F0EEE9',
    surfaceContainerHigh: '#EAE8E3',
    surfaceContainerHighest: '#E4E2DD',
    surfaceVariant: '#E4E2DD',

    primary: '#8F4E00',
    primaryDark: '#693800',
    primaryLight: '#FFDCC2',
    primaryContainer: '#FF9933',
    primaryFixed: '#FFDCC2',
    primaryFixedDim: '#FFB77A',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#693800',
    onPrimaryFixed: '#2E1500',
    onPrimaryFixedVariant: '#6D3A00',
    inversePrimary: '#FFB77A',
    primaryMuted: 'rgba(143, 78, 0, 0.12)',

    secondary: '#056E00',
    secondaryContainer: '#8DFC75',
    secondaryFixed: '#8DFC75',
    secondaryFixedDim: '#72DE5C',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#067500',
    onSecondaryFixed: '#012200',
    onSecondaryFixedVariant: '#035300',
    success: '#056E00',
    successLight: 'rgba(5, 110, 0, 0.10)',

    tertiary: '#79573F',
    tertiaryContainer: '#D4A98D',
    tertiaryFixed: '#FFDCC6',
    tertiaryFixedDim: '#EABDA0',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#5C3D28',
    onTertiaryFixed: '#2D1604',
    onTertiaryFixedVariant: '#5F402A',

    backgroundVariant: '#F0EEE9',
    text: '#1B1C19',
    textSecondary: '#554336',
    textMuted: '#887364',
    textInverse: '#F2F1EC',
    onBackground: '#1B1C19',
    onSurface: '#1B1C19',
    onSurfaceVariant: '#554336',
    inverseSurface: '#30312E',
    inverseOnSurface: '#F2F1EC',

    border: '#DBC2B0',
    borderLight: '#E4E2DD',
    outline: '#887364',
    outlineVariant: '#DBC2B0',

    card: '#FFFFFF',
    cardSecondary: '#F5F3EE',
    glass: 'rgba(255,255,255,0.72)',
    input: '#F5F3EE',

    warning: '#D97706',
    error: '#BA1A1A',
    errorLight: 'rgba(186, 26, 26, 0.10)',
    onError: '#FFFFFF',
    onErrorContainer: '#93000A',
    red: '#BA1A1A',
    green: '#056E00',

    glow: 'rgba(143, 78, 0, 0.12)',
    voiceGlow: 'rgba(255, 153, 51, 0.32)',
    voicePulse: 'rgba(255, 153, 51, 0.16)',
    voiceRing: 'rgba(255, 153, 51, 0.08)',

    tint: '#8F4E00',
    icon: '#887364',
    tabIconDefault: '#887364',
    tabIconSelected: '#8F4E00',
  },
  dark: {
    background: '#06111F',
    surface: '#0B1F3A',
    surfaceContainerLowest: '#020617',
    surfaceContainerLow: '#0F172A',
    surfaceContainer: '#111827',
    surfaceContainerHigh: '#1F2937',
    surfaceContainerHighest: '#334155',
    surfaceBright: '#06111F',
    surfaceDim: '#0B1220',
    surfaceVariant: '#1E293B',
    primaryDark: '#2563EB',
    primaryContainer: '#3B82F6',
    primary: '#60A5FA',
    primaryFixed: '#BFDBFE',
    primaryFixedDim: '#93C5FD',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#E0F2FE',
    onPrimaryFixed: '#020617',
    onPrimaryFixedVariant: '#0B1220',
    primaryMuted: 'rgba(96, 165, 250, 0.12)',
    inversePrimary: '#BFDBFE',
    borderLight: 'rgba(255,255,255,0.14)',
    outline: '#94A3B8',
    outlineVariant: 'rgba(148, 163, 184, 0.24)',
    input: '#0F172A',
    secondary: '#4ADE80',
    secondaryContainer: 'rgba(74, 222, 128, 0.16)',
    secondaryFixed: '#86EFAC',
    secondaryFixedDim: '#4ADE80',
    accent: '#4ADE80',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#DCFCE7',
    onSecondaryFixed: '#052E16',
    onSecondaryFixedVariant: '#14532D',
    tertiary: '#D6B7A7',
    tertiaryContainer: '#7A5D49',
    tertiaryFixed: '#EAD1C0',
    tertiaryFixedDim: '#C9A28E',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#FFF1EA',
    onTertiaryFixed: '#2A1710',
    onTertiaryFixedVariant: '#5C4034',
    backgroundVariant: '#0B1220',
    textMuted: '#94A3B8',
    text: '#F8FBFF',
    textSecondary: '#CBD5E1',
    textInverse: '#06111F',
    onBackground: '#F8FBFF',
    onSurface: '#F8FBFF',
    onSurfaceVariant: '#CBD5E1',
    inverseSurface: '#E2E8F0',
    inverseOnSurface: '#0F172A',
    border: 'rgba(255,255,255,0.08)',
    card: '#0F172A',
    cardSecondary: '#111827',
    glass: 'rgba(15, 23, 42, 0.72)',
    error: '#F87171',
    errorLight: 'rgba(248, 113, 113, 0.10)',
    onError: '#FFFFFF',
    onErrorContainer: '#450A0A',
    success: '#4ADE80',
    successLight: 'rgba(74, 222, 128, 0.10)',
    glow: 'rgba(96, 165, 250, 0.14)',
    voiceGlow: 'rgba(96, 165, 250, 0.14)',
    voicePulse: 'rgba(96, 165, 250, 0.10)',
    voiceRing: 'rgba(96, 165, 250, 0.06)',
    red: '#F87171',
    green: '#4ADE80',
    tint: '#60A5FA',
    icon: '#CBD5E1',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#60A5FA',

    primaryLight: 'rgba(96, 165, 250, 0.10)',
  },
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
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
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
