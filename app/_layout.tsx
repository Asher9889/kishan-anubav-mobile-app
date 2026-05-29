import { useAuthStore } from '@/features/auth/store/auth.store';
import '@/global.css';
import { useColorScheme } from '@/hooks/use-color-scheme';
import queryClient from "@/shared/api/queryClient";
import useAppBootstrap from '@/shared/bootstrap/useAppBootstrap';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';



export default function RootLayout() {
  useAppBootstrap();
  const colorScheme = useColorScheme();
  const { isAuthenticated, isBootstrapping } = useAuthStore();

  console.log("RootLayout rendered. isAuthenticated:", isAuthenticated, "isBootstrapping:", isBootstrapping);

  if (isBootstrapping) {
    return null; // or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>

        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{headerShown: false}}>
            {/* Public Screens */}
            {isAuthenticated ? <>
              <Stack.Screen name="(private)" />
              
            </>
              :
              <Stack.Screen name="(public)" />
            }
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
