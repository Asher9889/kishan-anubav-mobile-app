import { fetchMe } from "@/features/auth/api/me.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { Redirect, Stack } from "expo-router";
import { useEffect, useRef } from "react";

export default function PrivateLayout() {
  console.log('PrivateLayout mounted');
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const hasFetchedMeRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || hasFetchedMeRef.current) {
      return;
    }

    hasFetchedMeRef.current = true;

    const loadMe = async () => {
      try {
        const response = await fetchMe();
        const fetchedUser = response?.data.user;
        console.log("Fetched /me profile:", Object.keys(fetchedUser));
        console.log("Fetched /me profile (full):", fetchedUser.avatar, fetchedUser.fullName);

        if (fetchedUser) {
          setUser(fetchedUser);
        }
      } catch (error) {
        console.log("Failed to fetch /me profile:", error);
      }
    };

    void loadMe();
  }, [isAuthenticated, setUser]);

  if (!isAuthenticated) {
    return (
      <Redirect
        href="/(public)"
      />
    );
  }

  return (
    <Stack screenOptions={{headerShown: false, animation: "slide_from_right",}}>

      <Stack.Screen name="index" options={{ headerShown: false}}/>

      <Stack.Screen name="ai-chat" options={{headerShown: false}}/>

      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>

      <Stack.Screen name="(stack)" options={{headerShown: false}}/>
    </Stack>
  );
}