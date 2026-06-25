import { MessageBubble } from '@/components';
import Logo from '@/components/logo';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { ImagePickerService } from '@/services/camera.service';
import * as crypto from 'expo-crypto';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Home, ImagePlus, Mic, Send } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { convertAudioToText } from '../api/ask-audio-stream.api';
import { analyzeImage } from '../api/ask-image.api';
import { askQuestionStream } from '../api/ask-text-stream.api';
import ChatAudioRecorder from '../components/audio-recorder/ChatAudioRecorder';
import { ChatHistorySheet } from '../components/side-sheet/ChatHistorySheet';
import GeneratingState from '../components/states/GeneratingState';
import ListeningState from '../components/states/ListeningState';
import ThinkingState from '../components/states/ThinkingState';
import UploadingState from '../components/states/UploadingState';
import { createChat, getMessagesByChatId, saveAIMessage, saveUserMessage, updateChatTitle } from '../services/chat.service';
import { useChatStore } from '../store/chat.store';
import { ChatMessage, TSheetHandle } from '../types/types';

type TAIState = "idle" | "listening" | "uploading" | "thinking" | "generating";

const getWelcomeMessage = (t: (key: string) => string) => ({
  id: 'welcome',
  role: 'ai' as const,
  type: 'reply' as const,
  content: t('chat.welcomeMessage'),
})

export default function AIChatScreen() {
  const { t } = useTranslation('common');

  const [inputText, setInputText] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [composerMode, setComposerMode] = useState<'text' | 'audio'>('text');
  // const [aiState, setAiState] = useState<TAIState>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]); // db orienetd messages
  const [uiMessages, setUiMessages] = useState<ChatMessage[]>([]); // messages formatted for UI (with states like 'thinking', 'listening' etc)
  const [isGenerating, setIsGenerating] = useState(false);
  const typingTimerRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, []);

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

  // const replaceUiMessage = (id: string, message: Partial<ChatMessage>) => {
  //   setUiMessages((prev) => prev.map((msg) => msg.id === id ? { ...msg, ...message } : msg));
  // };

  const replaceUiMessage = (id: string, updater: Partial<ChatMessage> | ((prev: ChatMessage) => Partial<ChatMessage>)) => {
    setUiMessages((prev) => prev.map((msg) => {

      if (msg.id !== id) {
        return msg;
      }

      const updates = typeof updater === 'function' ? updater(msg) : updater;

      return {
        ...msg,
        ...updates,
      };
    })
    );
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

    if (isGenerating) return;
    setComposerMode('text');
    setIsGenerating(true);

    const thinkingMessageId = crypto.randomUUID();
    const userUiMessageId = crypto.randomUUID();
    const aiReplyMessageId = crypto.randomUUID();
    let hasCreatedAiReply = false;
    let fullAnswer = '';
    let displayedAnswer = '';
    let isStreamComplete = false;
    let currentChatId = activeChatIdState;

    addUiMessage({
      id: thinkingMessageId,
      role: 'ai',
      type: 'uploading',
    });

    const res = await convertAudioToText(audioUri);

    if (!res.success) {
      Alert.alert(t('chat.audioParsingFailed'), res.message);
      return;
    }
    const audioText = res.data.transcript;

    // uploading to thinking state
    replaceUiMessage(thinkingMessageId, {
      id: thinkingMessageId,
      role: 'ai',
      type: 'thinking',
    });

    const completeChatFlow = async () => {
      try {
        await saveAIMessage({
          chatId: currentChatId!,
          query: fullAnswer,
        });
        await loadMessages(currentChatId!);
        removeUiMessage(userUiMessageId);
        removeUiMessage(aiReplyMessageId);
      } catch (err) {
        console.log('Error completing chat flow:', err);
      } finally {
        setIsGenerating(false);
      }
    };

    const startTyping = () => {
      if (typingTimerRef.current) return;

      typingTimerRef.current = setInterval(() => {
        if (displayedAnswer.length < fullAnswer.length) {
          const remaining = fullAnswer.slice(displayedAnswer.length);
          if (!remaining) return;

          // Word by word typing effect
          const match = remaining.match(/^(\s*\S+)/);
          if (match) {
            const nextWord = match[1];
            displayedAnswer += nextWord;
          } else {
            displayedAnswer = fullAnswer;
          }

          if (!hasCreatedAiReply) {
            hasCreatedAiReply = true;
            removeUiMessage(thinkingMessageId);

            addUiMessage({
              id: aiReplyMessageId,
              role: 'ai',
              type: 'reply',
              content: displayedAnswer,
            });
          } else {
            replaceUiMessage(aiReplyMessageId, {
              content: displayedAnswer,
            });
          }
        } else if (isStreamComplete) {
          if (typingTimerRef.current) {
            clearInterval(typingTimerRef.current);
            typingTimerRef.current = null;
          }
          completeChatFlow();
        }
      }, 30);
    };

    try {
      /**
       * CREATE NEW CHAT
       * ONLY IF USER STARTED NEW CHAT
       */
      if (!currentChatId) {
        currentChatId = await createChat({ title: audioText });
        setActiveChatId(currentChatId);
      }

      /** START STREAM */


      await askQuestionStream(audioText, currentChatId, {
        // metadata handling
        async onMetadata(data) {
          replaceUiMessage(userUiMessageId, {
            content: audioText,
          });

          await updateChatTitle({
            chatId: data.thread_id,
            title: audioText,
          });

          await saveUserMessage({ chatId: data.thread_id, query: audioText });
        },

        onStart() {
          console.log('streaming started....');
        },

        onChunk(chunk) {
          fullAnswer += chunk;
          startTyping();
        },

        async onComplete(data) {
          console.log('streaming complete', data);
          isStreamComplete = true;
          // If the typing timer is not active or we've already finished typing everything
          if (!typingTimerRef.current || displayedAnswer.length >= fullAnswer.length) {
            if (typingTimerRef.current) {
              clearInterval(typingTimerRef.current);
              typingTimerRef.current = null;
            }
            await completeChatFlow();
          }
        },

        onError(error) {
          console.log('error', error);
          if (typingTimerRef.current) {
            clearInterval(typingTimerRef.current);
            typingTimerRef.current = null;
          }
          removeUiMessage(thinkingMessageId);
          removeUiMessage(userUiMessageId);
          removeUiMessage(aiReplyMessageId);
          setIsGenerating(false);
        }
      });

    } catch (error) {
      console.log('error inside text send flow', error);
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      removeUiMessage(thinkingMessageId);
      removeUiMessage(userUiMessageId);
      removeUiMessage(aiReplyMessageId);
      setIsGenerating(false);
    }



  };



  const handleImageUpload = async () => {
    if (isGenerating) return;

    const chosenOption = await new Promise<string | null>((resolve) => {
      Alert.alert(t('chat.imageAnalysis'), t('chat.chooseOption'), [
        { text: t('camera'), onPress: () => resolve("camera") },
        { text: t('gallery'), onPress: () => resolve("gallery") },
        { text: t('cancel'), onPress: () => resolve(null), style: "cancel" },
      ]);
    });

    if (!chosenOption) return;

    let asset;
    try {
      asset = chosenOption === "camera"
        ? await ImagePickerService.pickFromCamera()
        : await ImagePickerService.pickFromGallery();
    } catch (err: any) {
      Alert.alert(t('permissionDenied'), err.message);
      return;
    }

    if (!asset) return;

    setIsGenerating(true);

    const imageUri = asset.uri;
    const userImageMessageId = crypto.randomUUID();
    const thinkingMessageId = crypto.randomUUID();
    const aiReplyMessageId = crypto.randomUUID();
    let hasCreatedAiReply = false;
    let fullAnswer = '';
    let displayedAnswer = '';
    let isStreamComplete = false;
    let currentChatId = activeChatIdState;

    addUiMessage({
      id: userImageMessageId,
      role: 'user',
      type: 'message',
      content: imageUri,
    });

    addUiMessage({
      id: thinkingMessageId,
      role: 'ai',
      type: 'uploading',
      uploadType: 'image',
    });

    const res = await analyzeImage(imageUri);

    if (!res.success || !res.question_text) {
      Alert.alert(t('chat.imageAnalysisFailed'), res.message || t('chat.couldNotAnalyze'));
      removeUiMessage(thinkingMessageId);
      removeUiMessage(userImageMessageId);
      setIsGenerating(false);
      return;
    }

    console.log('Image analysis result:', res.question_text);
    const questionText = res.question_text;

    replaceUiMessage(thinkingMessageId, {
      id: thinkingMessageId,
      role: 'ai',
      type: 'thinking',
    });

    const completeChatFlow = async () => {
      try {
        await saveAIMessage({
          chatId: currentChatId!,
          query: fullAnswer,
        });
        await loadMessages(currentChatId!);
        removeUiMessage(userImageMessageId);
        removeUiMessage(aiReplyMessageId);
      } catch (err) {
        console.log('Error completing chat flow:', err);
      } finally {
        setIsGenerating(false);
      }
    };

    const startTyping = () => {
      if (typingTimerRef.current) return;

      typingTimerRef.current = setInterval(() => {
        if (displayedAnswer.length < fullAnswer.length) {
          const remaining = fullAnswer.slice(displayedAnswer.length);
          if (!remaining) return;

          const match = remaining.match(/^(\s*\S+)/);
          if (match) {
            const nextWord = match[1];
            displayedAnswer += nextWord;
          } else {
            displayedAnswer = fullAnswer;
          }

          if (!hasCreatedAiReply) {
            hasCreatedAiReply = true;
            removeUiMessage(thinkingMessageId);

            addUiMessage({
              id: aiReplyMessageId,
              role: 'ai',
              type: 'reply',
              content: displayedAnswer,
            });
          } else {
            replaceUiMessage(aiReplyMessageId, {
              content: displayedAnswer,
            });
          }
        } else if (isStreamComplete) {
          if (typingTimerRef.current) {
            clearInterval(typingTimerRef.current);
            typingTimerRef.current = null;
          }
          completeChatFlow();
        }
      }, 30);
    };

    try {
      if (!currentChatId) {
        currentChatId = await createChat({ title: "Image Analysis" });
        setActiveChatId(currentChatId);
      }

      await askQuestionStream(questionText, currentChatId, {
        async onMetadata(data) {
          replaceUiMessage(userImageMessageId, {
            content: imageUri,
          });

          await updateChatTitle({
            chatId: data.thread_id,
            title: "Image Analysis",
          });

          await saveUserMessage({ chatId: data.thread_id, query: questionText });
        },

        onStart() {
          console.log('image streaming started....');
        },

        onChunk(chunk) {
          fullAnswer += chunk;
          startTyping();
        },

        async onComplete(data) {
          console.log('image streaming complete', data);
          isStreamComplete = true;
          if (!typingTimerRef.current || displayedAnswer.length >= fullAnswer.length) {
            if (typingTimerRef.current) {
              clearInterval(typingTimerRef.current);
              typingTimerRef.current = null;
            }
            await completeChatFlow();
          }
        },

        onError(error) {
          console.log('error', error);
          if (typingTimerRef.current) {
            clearInterval(typingTimerRef.current);
            typingTimerRef.current = null;
          }
          removeUiMessage(thinkingMessageId);
          removeUiMessage(userImageMessageId);
          removeUiMessage(aiReplyMessageId);
          setIsGenerating(false);
        }
      });

    } catch (error) {
      console.log('error inside image send flow', error);
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      removeUiMessage(thinkingMessageId);
      removeUiMessage(userImageMessageId);
      removeUiMessage(aiReplyMessageId);
      setIsGenerating(false);
    }
  };

  const closeAudioComposer = () => {
    setComposerMode('text');
  };

  const handleSendText = async () => {
    if (!inputText.trim() || isGenerating) return;

    const queryText = inputText.trim();
    setInputText('');
    setInputFocused(false);
    setIsGenerating(true);

    const thinkingMessageId = crypto.randomUUID();
    const userUiMessageId = crypto.randomUUID();
    const aiReplyMessageId = crypto.randomUUID();
    let hasCreatedAiReply = false;
    let fullAnswer = '';
    let displayedAnswer = '';
    let isStreamComplete = false;
    let currentChatId = activeChatIdState;

    // Immediately display the user's question in the UI
    addUiMessage({
      id: userUiMessageId,
      role: 'user',
      type: 'message',
      content: queryText,
    });

    // Immediately display the thinking bubble
    addUiMessage({
      id: thinkingMessageId,
      role: 'ai',
      type: 'thinking',
    });

    const completeChatFlow = async () => {
      try {
        await saveAIMessage({
          chatId: currentChatId!,
          query: fullAnswer,
        });
        await loadMessages(currentChatId!);
        removeUiMessage(userUiMessageId);
        removeUiMessage(aiReplyMessageId);
      } catch (err) {
        console.log('Error completing chat flow:', err);
      } finally {
        setIsGenerating(false);
      }
    };

    const startTyping = () => {
      if (typingTimerRef.current) return;

      typingTimerRef.current = setInterval(() => {
        if (displayedAnswer.length < fullAnswer.length) {
          const remaining = fullAnswer.slice(displayedAnswer.length);
          if (!remaining) return;

          // Word by word typing effect
          const match = remaining.match(/^(\s*\S+)/);
          if (match) {
            const nextWord = match[1];
            displayedAnswer += nextWord;
          } else {
            displayedAnswer = fullAnswer;
          }

          if (!hasCreatedAiReply) {
            hasCreatedAiReply = true;
            removeUiMessage(thinkingMessageId);

            addUiMessage({
              id: aiReplyMessageId,
              role: 'ai',
              type: 'reply',
              content: displayedAnswer,
            });
          } else {
            replaceUiMessage(aiReplyMessageId, {
              content: displayedAnswer,
            });
          }
        } else if (isStreamComplete) {
          if (typingTimerRef.current) {
            clearInterval(typingTimerRef.current);
            typingTimerRef.current = null;
          }
          completeChatFlow();
        }
      }, 30);
    };

    try {
      /**
       * CREATE NEW CHAT
       * ONLY IF USER STARTED NEW CHAT
       */
      if (!currentChatId) {
        currentChatId = await createChat({ title: queryText });
        setActiveChatId(currentChatId);
      }

      /** START STREAM */
      await askQuestionStream(queryText, currentChatId, {
        // metadata handling
        async onMetadata(data) {
          replaceUiMessage(userUiMessageId, {
            content: data.query,
          });

          await updateChatTitle({
            chatId: data.thread_id,
            title: data.query,
          });

          await saveUserMessage({ chatId: data.thread_id, query: data.query });
        },

        onStart() {
          console.log('streaming started....');
        },

        onChunk(chunk) {
          fullAnswer += chunk;
          startTyping();
        },

        async onComplete(data) {
          console.log('text streaming complete', data);
          isStreamComplete = true;
          // If the typing timer is not active or we've already finished typing everything
          if (!typingTimerRef.current || displayedAnswer.length >= fullAnswer.length) {
            if (typingTimerRef.current) {
              clearInterval(typingTimerRef.current);
              typingTimerRef.current = null;
            }
            await completeChatFlow();
          }
        },

        onError(error) {
          console.log('error', error);
          if (typingTimerRef.current) {
            clearInterval(typingTimerRef.current);
            typingTimerRef.current = null;
          }
          removeUiMessage(thinkingMessageId);
          removeUiMessage(userUiMessageId);
          removeUiMessage(aiReplyMessageId);
          setIsGenerating(false);
        }
      });

    } catch (error) {
      console.log('error inside text send flow', error);
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      removeUiMessage(thinkingMessageId);
      removeUiMessage(userUiMessageId);
      removeUiMessage(aiReplyMessageId);
      setIsGenerating(false);
    }
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
        getWelcomeMessage(t),
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
  }, [renderedMessages]);


  return (
    <SafeAreaView style={styles.root}>
      <StatusBar backgroundColor={c.background} barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.headerBlur}>
          <View style={[  styles.headerContent]}>
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
              <Logo width={50} height={50} />
                {/* <Sparkles size={16} color="#FFFFFF" /> */}
              </LinearGradient>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>{t('appName')}</Text>
                <View style={styles.onlineRow}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineLabel}>{t('online')}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={1}
            >
              <Home size={22} color={c.text} />
            </TouchableOpacity>
 


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
            keyboardShouldPersistTaps={'handled'}
            keyboardDismissMode={'none'}
            contentContainerStyle={styles.messagesList}
            ItemSeparatorComponent={() => <View style={styles.messageGap} />}
            renderItem={({ item }) => {
              const isImageMessage = item.role === 'user' && item.content && (item.content.startsWith('file://') || item.content.startsWith('/'));

              switch (item.type) {
                case "listening":
                  return <ListeningState />;
                case "uploading":
                  return <UploadingState uploadType={item.uploadType} />;
                case "thinking":
                  return <ThinkingState />;

                case "generating":
                  return <GeneratingState />;
                // case "error":
                //   return <AIThinking />;
                default:
                  if (isImageMessage) {
                    return (
                      <View style={[styles.messageRow, styles.messageRowUser]}>
                        <View style={[styles.bubbleWrapper, styles.bubbleWrapperUser]}>
                          <View style={[styles.bubble, styles.bubbleUser, styles.imageBubbleUser]}>
                            <Image
                              source={{ uri: item.content }}
                              style={styles.chatImage}
                              contentFit="cover"
                              transition={300}
                            />
                          </View>
                        </View>
                      </View>
                    );
                  }
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
                  {/* Voice Centric Mic Button */}
                  <TouchableOpacity
                    onPress={() => !isGenerating && setComposerMode('audio')}
                    style={[styles.micButtonVoiceCentric, isGenerating && { opacity: 0.5 }]}
                    disabled={isGenerating}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[c.primaryContainer, '#FFB77A']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.micGradientVoiceCentric}
                    >
                      <Mic size={22} color="#FFFFFF" fill="rgba(255, 255, 255, 0.25)" />
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleImageUpload}
                    style={[styles.imageButton, isGenerating && { opacity: 0.5 }]}
                    disabled={isGenerating}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[c.primaryContainer, '#14B8A6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.imageButtonGradient}
                    >
                      <ImagePlus size={22} color="#FFFFFF" />
                    </LinearGradient>
                  </TouchableOpacity>

                  <View
                    style={[
                      styles.inputContainer,
                      inputFocused && styles.inputContainerFocused,
                    ]}
                    collapsable={false}
                  >
                    <View
                      style={styles.textInputArea}
                      collapsable={false}
                    >
                      <TextInput
                        placeholder={isGenerating ? t('chat.aiIsTyping') : t('chat.askQuestion')}
                        placeholderTextColor={c.textMuted}
                        value={inputText}
                        onChangeText={setInputText}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        style={styles.textInput}
                        collapsable={false}
                        editable={!isGenerating}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleSendText}
                    activeOpacity={0.85}
                    style={[
                      styles.sendButton,
                      (inputText.length === 0 || isGenerating) && styles.sendButtonDisabled,
                    ]}
                    disabled={inputText.length === 0 || isGenerating}
                  >
                    <LinearGradient
                      colors={
                        inputText.length > 0 && !isGenerating
                          ? [c.primaryDark, c.primary]
                          : [c.border, c.border]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.sendGradient}
                    >
                      <Send size={18} color={inputText.length > 0 && !isGenerating ? '#FFFFFF' : c.textMuted} />
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
    justifyContent: "space-evenly",
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
    lineHeight: undefined,
    color: Colors.light.text,
    paddingVertical: Platform.OS === 'ios' ? 0 : Spacing.sm,
  },
  textInputArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  micButtonVoiceCentric: {
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: Colors.light.primaryContainer,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  micGradientVoiceCentric: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: Colors.light.primaryContainer,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  imageButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBubbleUser: {
    padding: 4,
    borderBottomRightRadius: Radius.sm,
    overflow: 'hidden',
  },
  chatImage: {
    width: 200,
    height: 200,
    borderRadius: Radius.lg,
  },

  // Send Button
  sendButton: {
    borderRadius: 25,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
