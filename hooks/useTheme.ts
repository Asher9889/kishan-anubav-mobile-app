const useTheme = () => {
  // In your app, this would be: const theme = useTheme();
  // Replace with your actual hook implementation
  const isDark = false; // Get from your theme context
  
  const Colors = {
    light: {
      background: '#FBF9F4',
      surface: '#FBF9F4',
      surfaceContainerLowest: '#FFFFFF',
      surfaceContainerLow: '#F5F3EE',
      surfaceContainer: '#F0EEE9',
      surfaceContainerHigh: '#EAE8E3',
      surfaceContainerHighest: '#E4E2DD',
      primary: '#8F4E00',
      primaryDark: '#693800',
      primaryLight: '#FFDCC2',
      primaryContainer: '#FF9933',
      onPrimary: '#FFFFFF',
      onPrimaryContainer: '#693800',
      primaryMuted: 'rgba(143, 78, 0, 0.12)',
      secondary: '#056E00',
      secondaryContainer: '#8DFC75',
      success: '#056E00',
      successLight: 'rgba(5, 110, 0, 0.10)',
      tertiary: '#79573F',
      tertiaryContainer: '#D4A98D',
      text: '#1B1C19',
      textSecondary: '#554336',
      textMuted: '#887364',
      textInverse: '#F2F1EC',
      onBackground: '#1B1C19',
      onSurface: '#1B1C19',
      onSurfaceVariant: '#554336',
      border: '#DBC2B0',
      borderLight: '#E4E2DD',
      outline: '#887364',
      outlineVariant: '#DBC2B0',
      card: '#FFFFFF',
      cardSecondary: '#F5F3EE',
      glass: 'rgba(255,255,255,0.72)',
      warning: '#D97706',
      error: '#BA1A1A',
      errorLight: 'rgba(186, 26, 26, 0.10)',
      onError: '#FFFFFF',
      red: '#BA1A1A',
      green: '#056E00',
      glow: 'rgba(143, 78, 0, 0.12)',
      tint: '#8F4E00',
      icon: '#887364',
    },
    dark: {
      background: '#06111F',
      surface: '#0B1F3A',
      surfaceContainerLowest: '#020617',
      surfaceContainerLow: '#0F172A',
      surfaceContainer: '#111827',
      surfaceContainerHigh: '#1F2937',
      surfaceContainerHighest: '#334155',
      primary: '#60A5FA',
      primaryDark: '#2563EB',
      primaryContainer: '#3B82F6',
      onPrimary: '#FFFFFF',
      primaryMuted: 'rgba(96, 165, 250, 0.12)',
      text: '#F8FBFF',
      textSecondary: '#CBD5E1',
      textMuted: '#94A3B8',
      onBackground: '#F8FBFF',
      onSurface: '#F8FBFF',
      border: 'rgba(255,255,255,0.08)',
      borderLight: 'rgba(255,255,255,0.14)',
      card: '#0F172A',
      cardSecondary: '#111827',
      glass: 'rgba(15, 23, 42, 0.72)',
      error: '#F87171',
      errorLight: 'rgba(248, 113, 113, 0.10)',
      success: '#4ADE80',
      successLight: 'rgba(74, 222, 128, 0.10)',
      glow: 'rgba(96, 165, 250, 0.14)',
      tint: '#60A5FA',
      icon: '#CBD5E1',
    },
  };

  const Typography = {
    h1: { fontSize: 28, fontWeight: '800' as const, lineHeight: 34 },
    h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
    h3: { fontSize: 18, fontWeight: '700' as const, lineHeight: 24 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 26 },
    bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 26 },
    caption: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
    small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  };

  const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
  const Radius = { sm: 4, md: 8, lg: 12, xl: 16, xxl: 24, full: 9999 };

  return {
    colors: isDark ? Colors.dark : Colors.light,
    typography: Typography,
    spacing: Spacing,
    radius: Radius,
    isDark,
  };
};

export default useTheme;