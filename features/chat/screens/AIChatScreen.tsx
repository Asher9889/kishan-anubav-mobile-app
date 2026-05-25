import { MessageBubble } from '@/components';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { VoiceButton } from '@/features/voice';
import { useVoiceRecorder } from '@/features/voice/hooks/useVoiceRecorder';
import { uploadVoice } from '@/features/voice/services/voice.service';
import { BlurView } from 'expo-blur';
import * as crypto from "expo-crypto";
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatHistorySheet } from '../components/side-sheet/ChatHistorySheet';
import GeneratingState from '../components/states/GeneratingState';
import ListeningState from '../components/states/ListeningState';
import ThinkingState from '../components/states/ThinkingState';
import UploadingState from '../components/states/UploadingState';
import { createChat, getMessagesByChatId, saveConversation } from '../services/chat.service';
import { useChatStore } from '../store/chat.store';
import { ChatMessage, TSheetHandle } from '../types/types';
// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// const messages: ChatMessage[] = [
//   {
//     id: '1',
//     role: 'ai',
//     type: "reply",
//     content:
//       'Namaste Farmer! How can I help you today with your crops or farming questions?',
//     timestamp: '10:30 AM',
//   },
//   // {
//   //   id: '2',
//   //   role: 'user',
//   //   type: "message",
//   //   content: 'Mere gehun mein peele patte aa rahe hain',
//   //   timestamp: '10:31 AM',
//   // },
//   // {
//   //   id: '3',
//   //   role: 'user',
//   //   type: "message",
//   //   content: 'Mere gehun mein peele patte aa rahe hain',
//   //   timestamp: '10:31 AM',
//   // },
//   // {
//   //   id: '4',
//   //   role: 'user',
//   //   type: "message",
//   //   content: 'Mere gehun mein peele patte aa rahe hain',
//   //   timestamp: '10:31 AM',
//   // },
//   // {
//   //   id: '5',
//   //   role: 'user',
//   //   type: "message",
//   //   content: 'Mere gehun mein peele patte aa rahe hain',
//   //   timestamp: '10:31 AM',
//   // },
//   // {
//   //   id: '6',
//   //   role: 'user',
//   //   type: "thinking",
//   //   content: 'Mere gehun mein peele patte aa rahe hain',
//   //   timestamp: '10:31 AM',
//   // },
//   // {
//   //   id: '7',
//   //   role: 'ai',
//   //   type: "generating",
//   //   content: 'Yeh nitrogen ki kami ya fungal sankraman ka sanket ho sakta hai. Kya aap pattiyon ki photo bhej sakte hain?',
//   //   timestamp: '10:31 AM',
//   // },
//   // {
//   //   id: '8',
//   //   role: 'user',
//   //   type: "message",
//   //   content: 'Yeh nitrogen ki kami ya fungal sankraman ka sanket ho sakta hai. Kya aap pattiyon ki photo bhej sakte hain?',
//   //   timestamp: '10:31 AM',
//   // },
// ];

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
  // const [aiState, setAiState] = useState<TAIState>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]); // db orienetd messages
  const [uiMessages, setUiMessages] = useState<ChatMessage[]>([]); // messages state management like listening/thinking/uploading/generating

  const activeAIMessageId = useRef<string | null>(null);
  const flatListRef = useRef<FlatList>(null); // to scroll to bottom on new messages

  const thinkingTimeoutRef = useRef<number | null>(null); // to store thinking timeout ID
  const generatingTimeoutRef = useRef<number | null>(null); // to store generating timeout ID
  const sideSheetRef = useRef<TSheetHandle>(null); // for controlling side sheet from header

  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();

  const { activeChatIdState, setActiveChatId } = useChatStore();

  const c = Colors.light;

  const toggleListening = async () => {
    try {
      if (isRecording) {
        const audioUri = await stopRecording();
        if (!audioUri) {
          console.log("No audio URI returned from stopRecording");
          return;
        }
        // setAiState("uploading");
        replaceMessage(activeAIMessageId.current!, { type: "uploading" });

        // after 800 ms switing to thinking state
        thinkingTimeoutRef.current = setTimeout(() => {
          // setAiState("thinking");
          replaceMessage(activeAIMessageId.current!, { type: "thinking" });
        }, 800);
        // after total 2600 sec switching to generating state
        generatingTimeoutRef.current = setTimeout(() => {
          // setAiState("generating");
          replaceMessage(activeAIMessageId.current!, { type: "generating" });
        }, 2600);

        console.log("Audio URI:", audioUri);

        const { data } = await uploadVoice(audioUri);

        // save conversation in db
        let currentChatId = activeChatIdState;
        if (!currentChatId) {
          currentChatId = await createChat({
            title: data.query,
          });
        }

        /**
         * Remove temporary UI state FIRST
         */
        removeUiMessage(activeAIMessageId.current!);

        await saveConversation({
          chatId: currentChatId,
          query: data.query,
          answer: data.answer?.answer ?? "Unable to process audio input. Please try again.",
          audioUri,
        });
        // refresh messages from db
        await loadMessages(currentChatId);

        /**
         * NOW activate chat
         */
        if (!activeChatIdState) {
          setActiveChatId(currentChatId);
        }

        // now clear time out
        if (thinkingTimeoutRef.current) {
          clearTimeout(thinkingTimeoutRef.current);
        }

        if (generatingTimeoutRef.current) {
          clearTimeout(generatingTimeoutRef.current);
        }

      } else {
        const uniqueId = crypto.randomUUID();
        activeAIMessageId.current = uniqueId;
        await startRecording();

        // setAiState("listening");
        addUiMessage({
          id: uniqueId,
          role: "ai",
          type: "listening",
        });
      }
    } catch (error) {
      console.log("error inside chat component", error);
    }
  };

  // Helpers 
  const addUiMessage = (message: ChatMessage) => {
    setUiMessages((prev) => [
      ...prev,
      message,
    ]);
    scrollToBottom();
  };

  const replaceMessage = (id: string, updated: Partial<ChatMessage>) => {
    setUiMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, ...updated } : msg
      )
    );
    scrollToBottom();
  };

  const removeUiMessage = (id: string) => {
    setUiMessages((prev) =>
      prev.filter(
        (msg) => msg.id !== id
      )
    );
    scrollToBottom();
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({
        animated: true,

      });
    });
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

  useEffect(() => {
    scrollToBottom();
  }, [messages, uiMessages]);

  useEffect(() => {
    return () => {
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
      }

      if (generatingTimeoutRef.current) {
        clearTimeout(generatingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar backgroundColor={c.background} barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <BlurView intensity={50} tint="light" style={styles.headerBlur}>
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
        </BlurView>

        {/* Messages */}
        <View style={styles.flex}>
          <FlatList
            ref={flatListRef}
            data={messages.length === 0 ? [WELCOME_MESSAGE] : [...messages, ...uiMessages]} // combine initial messages with UI messages
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
          <BlurView intensity={60} tint="light" style={styles.bottomBar}>
            {/* Voice Button - Primary CTA */}
            <View style={styles.voiceSection}>
              <VoiceButton isListening={isRecording} onPress={toggleListening} />
              <Text style={styles.voiceHint}>
                {isRecording ? 'Tap to stop' : 'Tap to speak'}
              </Text>
            </View>

            {/* Text Input - Secondary */}
            {/* <View style={styles.inputRow}>
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
                  style={[styles.micSmall, inputText.length > 0 && styles.micSmallHidden]}
                >
                  <Mic size={20} color={c.textMuted} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
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
            </View> */}

          </BlurView>
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
