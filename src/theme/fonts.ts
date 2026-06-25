import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';

export const FontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  extraBold: 'Inter-ExtraBold',
} as const;

const fontAssets = {
  [FontFamily.regular]: Inter_400Regular,
  [FontFamily.medium]: Inter_500Medium,
  [FontFamily.semiBold]: Inter_600SemiBold,
  [FontFamily.bold]: Inter_700Bold,
  [FontFamily.extraBold]: Inter_800ExtraBold,
};

export function useLoadFonts(): { fontsLoaded: boolean } {
  const [fontsLoaded] = useFonts(fontAssets);
  return { fontsLoaded: fontsLoaded ?? false };
}
