import { MessageBubble } from '@/components';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { VoiceButton } from '@/features/voice';
import { useVoiceRecorder } from '@/features/voice/hooks/useVoiceRecorder';
import { uploadVoice } from '@/features/voice/services/voice.service';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Mic, Send, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

const messages = [
  {
    id: '1',
    role: 'assistant',
    content:
      'Namaste Farmer! How can I help you today with your crops or farming questions?',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    role: 'user',
    content: 'Mere gehun mein peele patte aa rahe hain',
    timestamp: '10:31 AM',
  },
  {
    id: '3',
    role: 'assistant',
    content:
      'Yeh nitrogen ki kami ya fungal sankraman ka sanket ho sakta hai. Kya aap pattiyon ki photo bhej sakte hain?',
    timestamp: '10:31 AM',
  },
];

export default function AIChatScreen() {
  const c = Colors.light;

  const [inputText, setInputText] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();

  console.log('Recording State:', { isRecording });

  const toggleListening = async () => {
    try {
      if (isRecording) {
        const audioUri = await stopRecording();

        if(!audioUri) {
          console.log("No audio URI returned from stopRecording");
          return;
        }
        console.log("Audio URI:", audioUri);

        const data = await uploadVoice(audioUri);

      } else {
        await startRecording();
      }
    } catch (error) {
      console.log(error);
    }
  };

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
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <ArrowLeft size={22} color={c.text} />
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
                <Text style={styles.headerTitle}>Kisna AI</Text>
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
            data={messages}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesList}
            ItemSeparatorComponent={() => <View style={styles.messageGap} />}
            renderItem={({ item }) => <MessageBubble item={item} />}
          />

          {/* Voice Status */}
          {isRecording && (
            <View style={styles.listeningBar}>
              <View style={styles.listeningDot} />
              <Text style={styles.listeningText}>Listening...</Text>
            </View>
          )}

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
            </View>

          </BlurView>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: Colors.light.surfaceSecondary,
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
