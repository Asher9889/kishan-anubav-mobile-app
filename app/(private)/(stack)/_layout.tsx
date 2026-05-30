import { Stack } from "expo-router";

export default function ChatLayout() {
  console.log('StackLayout mounted');
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitle: 'STACK_LAYOUT',
        animation: "slide_from_right",
      }}
    >
    </Stack>
  );
}