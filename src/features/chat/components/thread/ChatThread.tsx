import { ThreadPrimitive } from '@assistant-ui/react-native';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '@/constants/theme';
import ChatMessageView from './ChatMessageView';
import WelcomeMessage from './WelcomeMessage';

/**
 * The scrollable message list for the main thread. Owns the empty (welcome)
 * state and renders every message through `ChatMessageView`.
 */
export default function ChatThread() {
  return (
    <ThreadPrimitive.Root>
      <ThreadPrimitive.MessagesFlatList
        components={{ Message: ChatMessageView }}
        contentContainerStyle={styles.messagesList}
        ItemSeparatorComponent={() => <View style={styles.messageGap} />}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
      />

      <ThreadPrimitive.Empty>
        <WelcomeMessage />
      </ThreadPrimitive.Empty>
    </ThreadPrimitive.Root>
  );
}

const styles = StyleSheet.create({
  messagesList: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },

  messageGap: {
    height: Spacing.lg + 4,
  },
});