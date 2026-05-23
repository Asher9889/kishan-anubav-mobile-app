import { Colors, Radius, Spacing, Typography } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { AudioWaveform, Mic } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function VoiceButton({ isListening, onPress }: { isListening: boolean; onPress: () => void }) {
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Timer state
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isListening) {
      startTimeRef.current = Date.now();
      setElapsedMs(0);

      timerRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startTimeRef.current);
      }, 100); 

      const createPulse = (anim: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue: 1,
              duration: 1500,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        );

      const a1 = createPulse(pulse1, 0);
      const a2 = createPulse(pulse2, 500);
      const a3 = createPulse(pulse3, 1000);
      a1.start();
      a2.start();
      a3.start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.08,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      return () => {
        a1.stop();
        a2.stop();
        a3.stop();
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setElapsedMs(0);
      };
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedMs(0);
    }
  }, [isListening]);

  // Format elapsed time: MM:SS.ms (e.g., 00:12.4)
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
  };

  const pulseStyle = (anim: Animated.Value) => ({
    position: 'absolute' as const,
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.light.voicePulse,
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 0],
    }),
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2.2],
        }),
      },
    ],
  });

  return (
    <View style={styles.voiceButtonContainer}>
      <Animated.View style={pulseStyle(pulse1)} />
      <Animated.View style={pulseStyle(pulse2)} />
      <Animated.View style={pulseStyle(pulse3)} />

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.85}
          style={styles.voiceButtonInner}
        >
          <LinearGradient
            colors={
              isListening
                ? [Colors.light.primaryDark, Colors.light.primary]
                : [Colors.light.primary, '#14B8A6']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.voiceButtonGradient}
          >
            {isListening ? (
              <AudioWaveform size={28} color="#FFFFFF" strokeWidth={2.5} />
            ) : (
              <Mic size={28} color="#FFFFFF" strokeWidth={2.5} />
            )}

            {/* Timer overlay — appears when recording */}
            {isListening && (
              <View style={styles.timerOverlay}>
                <Text style={styles.timerText}>
                  {formatTime(elapsedMs)}
                </Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
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
    width: 68,
    height: 68,
    borderRadius: 34,
    
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  // Timer overlay inside button
  timerOverlay: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    ...Typography.small,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.primaryDark,
    letterSpacing: 0.5,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
    overflow: 'hidden',
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


export default VoiceButton;