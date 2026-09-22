import { useAuiState } from '@assistant-ui/react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';
import ChatMarkdown from '@/features/chat/components/chat-markdown';
import ThinkingState from '@/features/chat/components/states/ThinkingState';
import AIAvatar from '@/components/chat/AIAvatar';

/**
 * Renders one message row from the current thread's message state. Used as
 * `components.Message` inside `ThreadPrimitive.MessagesFlatList`.
 */
export default function ChatMessageView() {
  const role = useAuiState((state) => state.message.role);
  const parts = useAuiState((state) => state.message.content);
  const isRunning = useAuiState(
    (state) => state.message.status?.type === 'running'
  );

  const text = parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('\n');

  if (role === 'user') {
    return (
      <View style={[styles.row, styles.userRow]}>
        <View style={styles.userBubble}>
          <ChatMarkdown content={text || ''} isUser />
        </View>
      </View>
    );
  }

  if (isRunning && !text) {
    return <ThinkingState />;
  }

  return (
    <View style={[styles.row, styles.aiRow]}>
      <View style={styles.aiHeader}>
        <AIAvatar size={36} />

        <View style={styles.aiTitleContainer}>
          <Text style={styles.aiName}>Krishi AI</Text>
          <Text style={styles.aiStatus}>
            {isRunning ? 'Thinking...' : 'Assistant'}
          </Text>
        </View>
      </View>

      <View style={styles.aiContent}>
        <ChatMarkdown content={text || ''} isUser={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    marginBottom: Spacing.lg + 4,
  },

  userRow: {
    alignItems: 'flex-end',
  },

  aiRow: {
    alignItems: 'flex-start',
  },

  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  aiTitleContainer: {
    marginLeft: Spacing.sm,
  },

  aiName: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.light.text,
  },

  aiStatus: {
    ...Typography.caption,
    color: Colors.light.textMuted,
    marginTop: 2,
  },

  aiContent: {
    width: '95%',
    paddingLeft: 44,
  },

  userBubble: {
    maxWidth: '78%',
    backgroundColor: Colors.light.primary,
    borderRadius: 24,
    borderBottomRightRadius: Spacing.sm,
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: Spacing.xs,
  },
});