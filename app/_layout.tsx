import Logo from '@/components/logo';
import { useLoadFonts } from '@/constants/fonts';
import { useAuthStore } from '@/features/auth/store/auth.store';
import '@/global.css';
import { useColorScheme } from '@/hooks/use-color-scheme';
import '@/i18n';
import queryClient from "@/shared/api/queryClient";
import useAppBootstrap from '@/shared/bootstrap/useAppBootstrap';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { fontsLoaded } = useLoadFonts();
  useAppBootstrap();
  const colorScheme = useColorScheme();
  const { isAuthenticated, isBootstrapping } = useAuthStore();

  React.useEffect(() => {
    if (fontsLoaded && !isBootstrapping) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isBootstrapping]);

  if (!fontsLoaded || isBootstrapping) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FBF9F4' }}>
        <Logo width={140} height={140} />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

            <Stack screenOptions={{ headerShown: false }}>
              {isAuthenticated ? (
                <Stack.Screen name="(private)" />
              ) : (
                <Stack.Screen name="(public)" />
              )}
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
