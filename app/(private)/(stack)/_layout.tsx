import { Stack } from "expo-router";

export default function ChatLayout() {
  console.log('StackLayout mounted');
  return (
    <Stack screenOptions={{headerShown: false, headerTitle: 'STACK_LAYOUT', animation: "slide_from_right"}}>
      <Stack.Screen name="client-profile" options={{ headerTitle: 'Client Profile', animation: "slide_from_right" }} />
      <Stack.Screen name="knowledge" options={{headerTitle: "Knowledge Share", animation: "slide_from_left"}} />

    </Stack>
  );
}