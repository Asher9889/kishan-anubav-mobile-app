import { Stack } from "expo-router";

export default function KnowledgeLayout() {
  return (
    <Stack screenOptions={{headerShown: false, headerTitle: 'KNOWLEDGE_LAYOUT', animation: "slide_from_right"}}>
      <Stack.Screen  name="create" options={{headerTitle:'Create'}} />
    </Stack>
  );
}