import { MessageBubble } from '@/components';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { uploadVoice } from '@/features/voice/services/voice.service';
import * as crypto from 'expo-crypto';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic, Send, Sparkles } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatAudioRecorder from '../components/audio-recorder/ChatAudioRecorder';
import { ChatHistorySheet } from '../components/side-sheet/ChatHistorySheet';
import GeneratingState from '../components/states/GeneratingState';
import ListeningState from '../components/states/ListeningState';
import ThinkingState from '../components/states/ThinkingState';
import UploadingState from '../components/states/UploadingState';
import { createChat, getMessagesByChatId, saveConversation } from '../services/chat.service';
import { useChatStore } from '../store/chat.store';
import { ChatMessage, TSheetHandle } from '../types/types';

type TAIState = "idle" | "listening" | "uploading" | "thinking" | "generating";

let WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'ai',
  type: 'reply',
  content: 'Hello 👋 How can I help you today?',
}

export default function AIChatScreen() {

  const [inputText, setInputText] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [composerMode, setComposerMode] = useState<'text' | 'audio'>('text');
  // const [aiState, setAiState] = useState<TAIState>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]); // db orienetd messages
  const [uiMessages, setUiMessages] = useState<ChatMessage[]>([]); // messages formatted for UI (with states like 'thinking', 'listening' etc)

  const flatListRef = useRef<FlatList>(null); // to scroll to bottom on new messages
  const sideSheetRef = useRef<TSheetHandle>(null); // for controlling side sheet from header

  const { activeChatIdState, setActiveChatId } = useChatStore();

  const c = Colors.light;

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({
        animated: true,

      });
    });
  };
  // helpers
  const addUiMessage = (message: ChatMessage) => {
    setUiMessages((prev) => [...prev, message]);
  };

  const replaceUiMessage = (id: string, message: Partial<ChatMessage>) => {
    setUiMessages((prev) => prev.map((msg) => msg.id === id ? { ...msg, ...message } : msg));
  };

  const removeUiMessage = (id: string) => {
    setUiMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  // for the initial loading of messages when chat is selected or created
  const loadMessages = async (chatId: string) => {
    const dbMessages = await getMessagesByChatId(chatId);

    const formattedMessages: ChatMessage[] = dbMessages.map((message) => ({
      id: message.id,
      role: message.role,
      type: message.role === 'user' ? 'message' : 'reply',
      content: message.content ?? 'Unable to display message.',
    }));

    setMessages(formattedMessages);
  };

  const handleAudioComplete = async (audioUri: string) => {
    try {
      const aiStateId = crypto.randomUUID();
      addUiMessage({
        id: aiStateId,
        role: 'ai',
        type: 'uploading',
      });
      setComposerMode('text');

      const { data } = await uploadVoice(audioUri);


      setTimeout(() => {
        replaceUiMessage(aiStateId, { type: 'thinking', });
      }, 800);

      setTimeout(() => {
        replaceUiMessage(aiStateId, { type: 'generating' });
      }, 2200);


      let currentChatId = activeChatIdState;
      if (!currentChatId) {
        currentChatId = await createChat({
          title: data.query,
        });
      }

      await saveConversation({
        chatId: currentChatId,
        query: data.query,
        answer: data.answer?.answer ?? 'Unable to process audio input. Please try again.', audioUri
      });

      await loadMessages(currentChatId);
      removeUiMessage(aiStateId);

      if (!activeChatIdState) {
        setActiveChatId(currentChatId);
      }

    } catch (error) {
      console.log('error inside audio upload flow', error);
    }
  };

  const closeAudioComposer = () => {
    setComposerMode('text');
  };




  useEffect(() => {
    async function initializeChat() {

      if (!activeChatIdState) {
        setMessages([]);
        return;
      }

      await loadMessages(activeChatIdState);
    }
    initializeChat();

  }, [activeChatIdState]);


  const renderedMessages = useMemo(() => {

    return messages.length === 0
      ? [
        WELCOME_MESSAGE,
        ...uiMessages,
      ]
      : [
        ...messages,
        ...uiMessages,
      ];

  }, [messages, uiMessages]);

  useEffect(() => {
    if (renderedMessages.length > 0) {
      scrollToBottom();
    }
  }, [renderedMessages.length]);

  // const renderedMessages = useMemo(() => {

  //   return messages.length === 0
  //     ? [
  //         WELCOME_MESSAGE,
  //         ...uiMessages,
  //       ]
  //     : [
  //         ...messages,
  //         ...uiMessages,
  //       ];

  // }, [messages, uiMessages]);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar backgroundColor={c.background} barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View   style={styles.headerBlur}>
          <View style={styles.headerContent}>
            {/* <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <ArrowLeft size={22} color={c.text} />
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() => sideSheetRef.current?.open()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 24 }}>☰</Text>
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <LinearGradient
                colors={[c.primary, '#14B8A6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerAvatar}
              >
                <Sparkles size={16} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Krishi Anubhav AI</Text>
                <View style={styles.onlineRow}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineLabel}>Online</Text>
                </View>
              </View>
            </View>

            <View style={styles.headerRight} />
          </View>
        </View>

        {/* Messages */}
        <View style={styles.flex}>
          <FlatList
            ref={flatListRef}
            data={renderedMessages}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesList}
            ItemSeparatorComponent={() => <View style={styles.messageGap} />}
            renderItem={({ item }) => {
              switch (item.type) {
                case "listening":
                  return <ListeningState />;
                case "uploading":
                  return <UploadingState />;
                case "thinking":
                  return <ThinkingState />;

                case "generating":
                  return <GeneratingState />;
                // case "error":
                //   return <AIThinking />;
                default:
                  return <MessageBubble item={item} />;
              }
            }}
          />

          {/* Voice Status */}
          {/* {isRecording && (
            <View style={styles.listeningBar}>
              <View style={styles.listeningDot} />
              <Text style={styles.listeningText}>Listening...</Text>
            </View>
          )} */}

          {/* Bottom Bar */}
          <View style={styles.bottomBar}>
            {composerMode === 'audio' ? (
              <ChatAudioRecorder
                onClose={closeAudioComposer}
                onRecordingComplete={handleAudioComplete}
              />
            ) : (
              <>
                <View style={styles.inputRow}>
                  <View
                    style={[
                      styles.inputContainer,
                      inputFocused && styles.inputContainerFocused,
                    ]}
                  >
                    <TextInput
                      className=''
                      placeholder="Or type your question..."
                      placeholderTextColor={c.textMuted}
                      value={inputText}
                      onChangeText={setInputText}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      style={styles.textInput}
                    />
                    <TouchableOpacity
                      onPress={() => setComposerMode('audio')}
                      style={[styles.micSmall, inputText.length > 0 && styles.micSmallHidden]}
                      activeOpacity={0.8}
                    >
                      <Mic size={20} color={c.textMuted} />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={closeAudioComposer}
                    activeOpacity={0.85}
                    style={[
                      styles.sendButton,
                      inputText.length === 0 && styles.sendButtonDisabled,
                    ]}
                    disabled={inputText.length === 0}
                  >
                    <LinearGradient
                      colors={
                        inputText.length > 0
                          ? [c.primaryDark, c.primary]
                          : [c.border, c.border]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.sendGradient}
                    >
                      <Send size={18} color={inputText.length > 0 ? '#FFFFFF' : c.textMuted} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}

          </View>
        </View>


      </KeyboardAvoidingView>

      <ChatHistorySheet ref={sideSheetRef} />


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  flex: {
    flex: 1,
  },

  // Header
  headerBlur: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    marginLeft: Spacing.sm + 2,
  },
  headerTitle: {
    ...Typography.h3,
    fontSize: 17,
    color: Colors.light.text,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.light.success,
  },
  onlineLabel: {
    ...Typography.caption,
    color: Colors.light.success,
    marginLeft: 5,
  },
  headerRight: {
    width: 40,
  },

  // Messages
  messagesList: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  messageGap: {
    height: Spacing.lg + 4,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAI: {
    justifyContent: 'flex-start',
  },

  // AI Avatar
  aiAvatarContainer: {
    marginRight: Spacing.sm,
    marginBottom: 20,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bubbles
  bubbleWrapper: {
    maxWidth: '78%',
  },
  bubbleWrapperUser: {
    alignItems: 'flex-end',
  },
  aiNameLabel: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginBottom: 4,
    marginLeft: 2,
  },
  bubble: {
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: Spacing.md - 2,
    borderRadius: Radius.xxl,
  },
  bubbleUser: {
    backgroundColor: Colors.light.primary,
    borderBottomRightRadius: Radius.sm,
  },
  bubbleAI: {
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: 'rgba(13,148,136,0.08)',
    borderBottomLeftRadius: Radius.sm,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  bubbleText: {
    ...Typography.body,
  },
  bubbleTextUser: {
    color: Colors.light.textInverse,
  },
  bubbleTextAI: {
    color: Colors.light.text,
  },

  // Bubble Footer
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 2,
    gap: Spacing.sm,
  },
  timestamp: {
    ...Typography.small,
    color: Colors.light.textMuted,
  },
  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primaryMuted,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 4,
  },
  listenLabel: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.light.primary,
  },

  // Listening Bar
  listeningBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.light.primaryMuted,
    gap: Spacing.sm,
  },
  listeningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
  },
  listeningText: {
    ...Typography.caption,
    color: Colors.light.primary,
    fontWeight: '600',
  },

  // Bottom Bar
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  // Voice Section
  voiceSection: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  voiceButtonContainer: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonInner: {
    borderRadius: 44,
  },
  voiceButtonGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  voiceHint: {
    ...Typography.caption,
    color: Colors.light.textMuted,
    marginTop: Spacing.xs + 2,
  },

  // Input Row
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.input,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    minHeight: 52,
  },
  inputContainerFocused: {
    borderColor: Colors.light.primary,
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.light.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  textInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.light.text,
    paddingVertical: Spacing.sm,
  },
  micSmall: {},
  micSmallHidden: {
    width: 0,
    opacity: 0,
  },

  // Send Button
  sendButton: {
    borderRadius: 26,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
