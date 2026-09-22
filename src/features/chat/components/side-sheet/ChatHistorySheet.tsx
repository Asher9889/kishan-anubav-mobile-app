import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Pressable,
  StyleSheet,
} from 'react-native';

import {
  MessageSquarePlus,
  MessageSquareText,
  X,
} from 'lucide-react-native';

import {
  ThreadListPrimitive,
  ThreadListItemPrimitive,
  useAuiState,
} from '@assistant-ui/react-native';

import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';

import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Colors } from '@/constants/theme';

import { useChatStore } from '../../store/chat.store';
import { TSheetHandle } from '../../types/types';

/**
 * One row in the recent-chats list. Rendered inside
 * `ThreadListPrimitive.Items` within the per-item `threadListItem` scope, so
 * all state (title, date, active highlight) comes from the runtime.
 */
function ChatListRow() {
  const c = Colors.light;
  const lastMessageAt = useAuiState((state) => state.threadListItem.lastMessageAt);

  return (
    <ThreadListItemPrimitive.Root>
      <ThreadListItemPrimitive.Trigger>
        {({ isActive }) => (
          <View
            style={[
              styles.chatItem,
              {
                backgroundColor: isActive ? c.primaryContainer : 'transparent',
                borderColor: isActive ? c.primary : 'transparent',
              },
            ]}
          >
            <View
              style={[
                styles.chatIconContainer,
                {
                  backgroundColor: isActive ? c.primary : c.surface,
                },
              ]}
            >
              <MessageSquareText
                size={16}
                color={isActive ? '#FFFFFF' : c.textMuted}
              />
            </View>

            <View style={styles.chatContent}>
              <Text
                numberOfLines={1}
                style={[
                  styles.chatTitle,
                  {
                    color: isActive ? c.text : c.textMuted,
                  },
                ]}
              >
                <ThreadListItemPrimitive.Title fallback="New Chat" />
              </Text>

              <Text
                style={[
                  styles.chatMeta,
                  {
                    color: c.textMuted,
                  },
                ]}
              >
                {lastMessageAt
                  ? new Date(lastMessageAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Today'}
              </Text>
            </View>
          </View>
        )}
      </ThreadListItemPrimitive.Trigger>
    </ThreadListItemPrimitive.Root>
  );
}

export const ChatHistorySheet = forwardRef<TSheetHandle>(
  function ChatHistorySheet(_, ref) {
    const [isOpen, setIsOpen] = useState(false);

    const c = Colors.light;
    const insets = useSafeAreaInsets();
    const activeChatIdState = useChatStore((state) => state.activeChatIdState);

    useImperativeHandle(
      ref,
      () => ({
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        isOpen,
      }),
      [isOpen]
    );

    /**
     * Thread switches (selecting a chat or pressing "New Chat") are driven by
     * the runtime through the controlled thread id. Close the sheet whenever
     * it changes so navigation feels instant.
     */
    useEffect(() => {
      if (activeChatIdState === undefined) return;
      setIsOpen(false);
    }, [activeChatIdState]);

    return (
      <Sheet
        open={isOpen}
        onOpenChange={setIsOpen}
        side="left"
      >
        <SheetContent
          style={
            {
              width: '84%',
              maxWidth: 360,
              borderRightWidth: 1,
              paddingHorizontal: 0,
              backgroundColor: c.background,
              borderRightColor: c.border,
              flex: 1,
            }
          }
        >
          {/* HEADER */}
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <View style={styles.headerTop}>
              <View>
                <Text
                  style={[
                    styles.title,
                    {
                      color: c.text,
                    },
                  ]}
                >
                  Krishi Anubhav AI
                </Text>

                <Text
                  style={[
                    styles.subtitle,
                    {
                      color: c.textMuted,
                    },
                  ]}
                >
                  Recent conversations
                </Text>
              </View>

              <Pressable
                onPress={() => setIsOpen(false)}
                style={[
                  styles.closeButton,
                  {
                    backgroundColor: c.primaryContainer,
                  },
                ]}
              >
                <X
                  size={18}
                  color={c.text}
                />
              </Pressable>
            </View>

            {/* NEW CHAT */}
            <ThreadListPrimitive.New
              style={[
                styles.newChatButton,
                {
                  backgroundColor: c.primary,
                },
              ]}
            >
              <MessageSquarePlus
                size={18}
                color="#FFFFFF"
              />

              <Text
                style={styles.newChatText}
              >
                New Chat
              </Text>
            </ThreadListPrimitive.New>
          </View>

          {/* SECTION LABEL */}
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: c.textMuted,
                },
              ]}
            >
              Recent chats
            </Text>
          </View>

          {/* CHAT LIST */}
          <ThreadListPrimitive.Root>
            <ThreadListPrimitive.Items
              contentContainerStyle={styles.chatList}
              showsVerticalScrollIndicator={true}
              renderItem={({ threadId }) => (
                <ChatListRow key={threadId} />
              )}
            />
          </ThreadListPrimitive.Root>

          {/* FOOTER */}
          <View
            style={[
              styles.footer,
              {
                borderTopColor: c.border,
              },
            ]}
          >
            <View
              style={styles.onlineRow}
            >
              <View
                style={[
                  styles.onlineDot,
                  {
                    backgroundColor: c.success,
                  },
                ]}
              />

              <Text
                style={[
                  styles.onlineText,
                  {
                    color: c.textMuted,
                  },
                ]}
              >
                AI Assistant Online
              </Text>
            </View>
          </View>
        </SheetContent>
      </Sheet>
    );
  }
);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.6,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  newChatButton: {
    marginTop: 22,
    height: 54,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  newChatText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  sectionHeader: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
  },

  chatList: {
    paddingHorizontal: 12,
    gap: 4,
  },

  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
  },

  chatIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chatContent: {
    flex: 1,
  },

  chatTitle: {
    fontSize: 15,
    fontWeight: '600',
  },

  chatMeta: {
    marginTop: 2,
    fontSize: 12,
  },

  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },

  onlineText: {
    fontSize: 13,
    fontWeight: '500',
  },
});