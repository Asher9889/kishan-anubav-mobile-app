import { ComposerPrimitive, useAui, useAuiState } from '@assistant-ui/react-native';
import { AudioLines, Plus, Send, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { convertAudioToText } from '@/features/chat/api/ask-audio-stream.api';
import ChatAudioRecorder from '@/features/chat/components/audio-recorder/ChatAudioRecorder';

interface ChatComposerProps {
  composerMode: 'text' | 'audio';
  onComposerModeChange: (mode: 'text' | 'audio') => void;
  /** Whether a LiveKit voice session is active (orb button becomes "close"). */
  sessionLive: boolean;
  onOrbPress: () => void;
  onCloseSession: () => void;
  onOpenMore: () => void;
}

/**
 * The bottom input area for the chat screen. Text uses the assistant-ui
 * composer; the recorded voice note is transcribed and submitted as a normal
 * text message so every input (text, voice, image) funnels through the same
 * `/v3/ask` path.
 */
export default function ChatComposer({
  composerMode,
  onComposerModeChange,
  sessionLive,
  onOrbPress,
  onCloseSession,
  onOpenMore,
}: ChatComposerProps) {
  const { t } = useTranslation('common');
  const c = Colors.light;

  const aui = useAui();
  const inputText = useAuiState((state) => state.composer.text);
  const isRunning = useAuiState((state) => state.thread.isRunning);

  const [transcribing, setTranscribing] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const isBusy = isRunning || transcribing;

  const handleAudioComplete = async (audioUri: string) => {
    onComposerModeChange('text');
    setTranscribing(true);

    try {
      const result = await convertAudioToText(audioUri);

      if (!result.success) {
        Alert.alert(t('chat.audioParsingFailed'), result.message);
        return;
      }

      const transcript = result.data.transcript.trim();
      if (!transcript) return;

      aui.composer.setText(transcript);
      aui.composer.send();
    } catch (error) {
      console.log('Voice note transcription failed:', error);
      Alert.alert(t('chat.audioParsingFailed'));
    } finally {
      setTranscribing(false);
    }
  };

  if (composerMode === 'audio') {
    return (
      <View style={styles.bottomBar}>
        <ChatAudioRecorder
          onClose={() => onComposerModeChange('text')}
          onRecordingComplete={handleAudioComplete}
        />
      </View>
    );
  }

  return (
    <View style={styles.bottomBar}>
      <ComposerPrimitive.Root style={styles.inputRow}>
        <View
          style={[
            styles.inputContainer,
            inputFocused && styles.inputContainerFocused,
          ]}
          collapsable={false}
        >
          <TouchableOpacity
            disabled={isBusy}
            activeOpacity={0.5}
            onPress={onOpenMore}
          >
            <Plus size={26} color="#000" fill="rgba(255, 255, 255, 0.25)" />
          </TouchableOpacity>

          <View style={styles.textInputArea} collapsable={false}>
            <ComposerPrimitive.Input
              placeholder={isBusy ? t('chat.aiIsTyping') : t('chat.askQuestion')}
              placeholderTextColor={c.textMuted}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              editable={!isRunning}
              style={styles.textInput}
              collapsable={false}
            />
          </View>

          {isRunning ? (
            <View style={styles.actionButton}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          ) : inputText.length > 0 ? (
            <ComposerPrimitive.Send style={styles.actionButton}>
              <Send size={20} color="#FFFFFF" />
            </ComposerPrimitive.Send>
          ) : sessionLive ? (
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.85}
              onPress={onCloseSession}
            >
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.85}
              onPress={onOrbPress}
            >
              <AudioLines size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </ComposerPrimitive.Root>

      {transcribing && (
        <View style={styles.transcribingRow}>
          <ActivityIndicator size="small" color={c.primary} />
          <Text style={[styles.transcribingText, { color: c.textMuted }]}>
            {t('chat.transcribing')}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.input,
    borderWidth: 0.5,
    borderColor: Colors.light.border,
    borderRadius: Radius.xxl,
    paddingHorizontal: Spacing.md,
    paddingVertical: 0,
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

  textInputArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  textInput: {
    flex: 1,
    ...Typography.body,
    lineHeight: undefined,
    color: Colors.light.text,
    paddingVertical: 0,
  },

  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  transcribingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingLeft: Spacing.xs,
  },

  transcribingText: {
    ...Typography.caption,
    fontWeight: '600',
  },
});