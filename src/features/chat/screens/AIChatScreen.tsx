import { AssistantRuntimeProvider, useAuiState } from '@assistant-ui/react-native';
import Logo from '@/components/logo';
import { Colors } from '@/constants/theme';
import VoiceSessionController from '@/features/voice/components/VoiceSessionController';
import useVoiceSession from '@/features/voice/hooks/useVoiceSession';
import { ImagePickerService } from '@/services/camera.service';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Home } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { analyzeImage } from '../api/ask-image.api';
import ChatMoreIcons from '../components/ChatMoreIcons';
import ChatComposer from '../components/composer/ChatComposer';
import { ChatHistorySheet } from '../components/side-sheet/ChatHistorySheet';
import ChatThread from '../components/thread/ChatThread';
import { useAskChat } from '../hooks/useAskChat';
import { TSheetHandle } from '../types/types';
import styles from './styles';

/**
 * The "+" menu is gated on whether the thread is currently streaming.
 */
function ChatMoreMenu(props: {
  open: boolean;
  onClose: () => void;
  onMicePress: () => void;
  onGalleryPress: () => void;
  onCameraPress: () => void;
}) {
  const isRunning = useAuiState((state) => state.thread.isRunning);

  return (
    <ChatMoreIcons
      open={props.open}
      onClose={props.onClose}
      isGenerating={isRunning}
      onMicePress={props.onMicePress}
      onGalleryPress={props.onGalleryPress}
      onCameraPress={props.onCameraPress}
    />
  );
}

export default function AIChatScreen() {
  const { t } = useTranslation('common');

  const c = Colors.light;

  const runtime = useAskChat();

  const [composerMode, setComposerMode] = useState<'text' | 'audio'>('text');
  const [showMoreInputBox, setShowMoreInputBox] = useState(false);

  const sideSheetRef = useRef<TSheetHandle>(null);

  const router = useRouter();

  const { startSession, stopSession, voiceState, sessionData, handleConnected, handleError, handleAgentStateChange } = useVoiceSession();

  const handleOrbPress = async () => {
    if (sessionData) return;
    try {
      await startSession();
    } catch (error) {
      console.log('Error generating voice chat token:', error);
      Alert.alert(t('chat.voiceChatTokenFailed'), t('chat.voiceChatNotAvailable'));
    }
  };

  const handleCloseSession = () => {
    stopSession();
  };

  const handleRetry = async () => {
    stopSession();
    await startSession();
  };

  const closeMoreMenu = () => setShowMoreInputBox(false);

  const openAudioComposer = () => {
    setShowMoreInputBox(false);
    setComposerMode('audio');
  };

  const handleImageUpload = async (option: string) => {
    setShowMoreInputBox(false);

    if (!option) return;

    let asset;
    try {
      asset = option === 'camera'
        ? await ImagePickerService.pickFromCamera()
        : await ImagePickerService.pickFromGallery();
    } catch (err: any) {
      Alert.alert(t('permissionDenied'), err.message);
      return;
    }

    if (!asset) return;

    const res = await analyzeImage(asset.uri);

    if (!res.success || !res.question_text) {
      Alert.alert(t('chat.imageAnalysisFailed'), res.message || t('chat.couldNotAnalyze'));
      return;
    }

    // Sends the analysed question through the composer so it streams like any
    // other message in the current thread.
    runtime.threads.main.append(res.question_text);
  };

  return (
    <SafeAreaView style={styles.root}>
      <AssistantRuntimeProvider runtime={runtime}>
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
            <ChatThread />

            <ChatComposer
              composerMode={composerMode}
              onComposerModeChange={setComposerMode}
              sessionLive={!!sessionData}
              onOrbPress={handleOrbPress}
              onCloseSession={handleCloseSession}
              onOpenMore={() => setShowMoreInputBox(true)}
            />

            <ChatMoreMenu
              open={showMoreInputBox}
              onClose={closeMoreMenu}
              onMicePress={openAudioComposer}
              onGalleryPress={() => handleImageUpload('gallery')}
              onCameraPress={() => handleImageUpload('camera')}
            />

            {showMoreInputBox && (
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={closeMoreMenu}
              />
            )}

            <VoiceSessionController
              session={sessionData}
              voiceState={voiceState}
              onConnected={handleConnected}
              onError={handleError}
              onAgentStateChange={handleAgentStateChange}
              onRetry={handleRetry}
            />
          </View>
        </KeyboardAvoidingView>

        <ChatHistorySheet ref={sideSheetRef} />
      </AssistantRuntimeProvider>
    </SafeAreaView>
  );
}