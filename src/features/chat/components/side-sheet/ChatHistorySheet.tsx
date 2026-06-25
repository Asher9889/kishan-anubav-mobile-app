import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  MessageSquarePlus,
  MessageSquareText,
  X,
} from 'lucide-react-native';

import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';

import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Colors } from '@/constants/theme';

import { getChats } from '../../services/chat.service';
import { useChatStore } from '../../store/chat.store';
import { TSheetHandle } from '../../types/types';

export const ChatHistorySheet = forwardRef<TSheetHandle>(
  function ChatHistorySheet(_, ref) {
    const [isOpen, setIsOpen] = useState(false);

    const [activeChat, setActiveChat] = useState('1');
    const [chatList, setChatList] = useState<{ id: string; title: string, lastMessageAt: number }[]>([]);

    const c = Colors.light;
    const insets = useSafeAreaInsets();
    const { setActiveChatId } = useChatStore();

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
     * Replace later with SQLite data
     */
    // const chats = useMemo();

    const handleSelectChat = (chatId: string) => {
      setActiveChat(chatId);
      setActiveChatId(chatId);
      setIsOpen(false);
    };

    useEffect(() => {
      if (!isOpen) return;
      async function loadChats() {

        const result = await getChats();
        setChatList(result);
      }
      loadChats();
    }, [isOpen])

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
                    backgroundColor:
                      c.primaryContainer,
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
            <TouchableOpacity
              activeOpacity={0.88}
              style={[
                styles.newChatButton,
                {
                  backgroundColor:
                    c.primary,
                },
              ]}
              onPress={() => {
                setActiveChatId(null)
                setActiveChat('');
                setIsOpen(false);
              }}
            >
              <MessageSquarePlus
                size={18}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.newChatText
                }
              >
                New Chat
              </Text>
            </TouchableOpacity>
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
              RECENT CHATS
            </Text>
          </View>

          {/* CHAT LIST
          <View style={styles.chatList}>
            {chatList.map((chat) => {
              const isActive = activeChat === chat.id;

              return (
                <TouchableOpacity
                  key={chat.id}
                  activeOpacity={0.75}
                  onPress={() => {
                    handleSelectChat(chat.id)
                  }}
                  style={[
                    styles.chatItem,
                    {
                      backgroundColor:
                        isActive
                          ? c.primaryContainer
                          : 'transparent',

                      borderColor:
                        isActive
                          ? c.primary
                          : 'transparent',
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
                      color={
                        isActive ? '#FFFFFF' : c.textMuted
                      }
                    />
                  </View>

                  <View style={ styles.chatContent}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.chatTitle,
                        {
                          color: isActive ? c.text : c.textMuted,
                        },
                      ]}
                    >
                      {chat.title}
                    </Text>

                    <Text
                      style={[
                        styles.chatMeta,
                        {
                          color:
                            c.textMuted,
                        },
                      ]}
                    >
                      Today
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View> 
          */}

          <FlatList
            data={chatList}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={[styles.chatList]}
            renderItem={({ item: chat }) => {

              const isActive = activeChat === chat.id;

              return (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => {
                    handleSelectChat(chat.id);
                  }}
                  style={[
                    styles.chatItem,
                    {
                      backgroundColor:
                        isActive
                          ? c.primaryContainer
                          : 'transparent',

                      borderColor:
                        isActive
                          ? c.primary
                          : 'transparent',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.chatIconContainer,
                      {
                        backgroundColor:
                          isActive
                            ? c.primary
                            : c.surface,
                      },
                    ]}
                  >
                    <MessageSquareText
                      size={16}
                      color={
                        isActive
                          ? '#FFFFFF'
                          : c.textMuted
                      }
                    />
                  </View>

                  <View style={styles.chatContent}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.chatTitle,
                        {
                          color: isActive
                            ? c.text
                            : c.textMuted,
                        },
                      ]}
                    >
                      {chat.title}
                    </Text>

                    <Text
                      style={[
                        styles.chatMeta,
                        {
                          color: c.textMuted,
                        },
                      ]}
                    >
                      {new Date(chat.lastMessageAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          {/* FOOTER */}
          <View
            style={[
              styles.footer,
              {
                borderTopColor:
                  c.border,
              },
            ]}
          >
            <View
              style={
                styles.onlineRow
              }
            >
              <View
                style={[
                  styles.onlineDot,
                  {
                    backgroundColor:
                      c.success,
                  },
                ]}
              />

              <Text
                style={[
                  styles.onlineText,
                  {
                    color:
                      c.textMuted,
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
  sheetContent: {
    width: '84%',
    maxWidth: 360,
    borderRightWidth: 1,
    paddingHorizontal: 0,
  },

  header: {
    paddingHorizontal: 20,
    // paddingTop: 10,
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
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
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