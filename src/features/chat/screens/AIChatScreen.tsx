import { MessageBubble } from '@/components';
import Logo from '@/components/logo';
import { Colors } from '@/constants/theme';
import ChatBottomBar from '@/features/voice/components/bottom-bar/ChatBottomBar';
import VoiceSessionController from '@/features/voice/components/VoiceSessionController';
import useVoiceChat from '@/features/voice/hooks/useVoiceChat';
import { ImagePickerService } from '@/services/camera.service';
import * as crypto from 'expo-crypto';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Home } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { convertAudioToText } from '../api/ask-audio-stream.api';
import { analyzeImage } from '../api/ask-image.api';
import { askQuestionStream } from '../api/ask-text-stream.api';
import ChatInputMoreItems from '../components/ChatMoreIcons';
import { ChatHistorySheet } from '../components/side-sheet/ChatHistorySheet';
import GeneratingState from '../components/states/GeneratingState';
import ListeningState from '../components/states/ListeningState';
import ThinkingState from '../components/states/ThinkingState';
import UploadingState from '../components/states/UploadingState';
import { createChat, getMessagesByChatId, saveAIMessage, saveUserMessage, updateChatTitle } from '../services/chat.service';
import { useChatStore } from '../store/chat.store';
import { ChatMessage, TSheetHandle } from '../types/types';
import styles from './styles';

const getWelcomeMessage = (t: (key: string) => string) => ({
  id: 'welcome',
  role: 'ai' as const,
  type: 'reply' as const,
  content: t('chat.welcomeMessage'),
})

export default function AIChatScreen() {
  const { t } = useTranslation('common');

  const insets = useSafeAreaInsets();

  const [inputText, setInputText] = useState('');
  const [composerMode, setComposerMode] = useState<'text' | 'audio'>('text');
  const [messages, setMessages] = useState<ChatMessage[]>([]); // db orienetd messages
  const [uiMessages, setUiMessages] = useState<ChatMessage[]>([]); // messages formatted for UI (with states like 'thinking', 'listening' etc)
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMoreInputBox, setShowMoreInputBox] = useState<boolean>(false);
  const { activeChatIdState, setActiveChatId } = useChatStore();


  const typingTimerRef = useRef<any>(null);

  const flatListRef = useRef<FlatList>(null); // to scroll to bottom on new messages
  const sideSheetRef = useRef<TSheetHandle>(null); // for controlling side sheet from header

  const router = useRouter();

  const { startSession, stopSession, voiceState, setVoiceState, sessionData } = useVoiceChat();

  const handleOrbPress = async () => {
    if (sessionData) return; // already connected, no need to generate token again
    if (isGenerating) return;
    try {
      await startSession();
    }
    catch (error) {
      console.log('Error generating voice chat token:', error);
      Alert.alert(t('chat.voiceChatTokenFailed'), t('chat.voiceChatNotAvailable'));
    }
  }

  const handleCloseSession = () => {
    stopSession();
  }

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, []);

  const c = Colors.light;

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({
        animated: true,
      });
    });
  };

  const addUiMessage = (message: ChatMessage) => {
    setUiMessages((prev) => [...prev, message]);
  };

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
    setShowMoreInputBox(false);
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

  const handleImageUpload = async (option: string) => {

    if (isGenerating) return;
    setShowMoreInputBox(false);

    if (!option) return;

    let asset;
    try {
      asset = option === "camera"
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

  const openAudioComposer = () => {
    setShowMoreInputBox(false);
    setComposerMode('audio')
  }

  const handleSendText = async () => {
    if (!inputText.trim() || isGenerating) return;

    const queryText = inputText.trim();
    setInputText('');
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

  const handleMoreInputBox = () => {
    const change = !showMoreInputBox;
    setShowMoreInputBox(change);
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar backgroundColor={c.background} barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.headerBlur}>
          <View style={[styles.headerContent]}>

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
              <Home size={26} color={c.text} />
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

          <ChatBottomBar
            state={sessionData ? true : false}
            composerMode={composerMode}
            onOpenMoreInputBox={() => setShowMoreInputBox(true)}
            isGenerating={isGenerating}
            inputText={inputText}
            onTextChange={setInputText}
            onSendText={handleSendText}
            onAudioComplete={handleAudioComplete}
            onCloseAudio={closeAudioComposer}
            onOrbPress={handleOrbPress}
            onCloseSession={handleCloseSession}
          />

          <ChatInputMoreItems
            open={showMoreInputBox}
            onClose={handleMoreInputBox}
            isGenerating={isGenerating}
            onMicePress={openAudioComposer}
            onGalleryPress={() => handleImageUpload('gallery')}
            onCameraPress={() => handleImageUpload('camera')}
          />

          {showMoreInputBox &&
            <Pressable
              style={[StyleSheet.absoluteFill]}
              onPress={() => setShowMoreInputBox(false)}
            />
          }

          <VoiceSessionController
            session={sessionData}
            voiceState={voiceState}
            onConnected={() => {
              setVoiceState("connected")
              // soundService.play("connected");
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }}
          />

        </View>

      </KeyboardAvoidingView>

      <ChatHistorySheet ref={sideSheetRef} />




    </SafeAreaView>
  );
}


