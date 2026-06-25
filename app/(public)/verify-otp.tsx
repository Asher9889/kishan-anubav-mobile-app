import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import useVerifyOtp from '@/features/auth/hooks/useVerifyOtp';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

// ============================================================================
// Types
// ============================================================================

interface VerifyOtpScreenProps {
  phoneNumber?: string;
  onVerify?: (otp: string) => void;
  onResend?: () => void;
  onChangeNumber?: () => void;
}

interface OtpInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  delay?: number;
}

interface VerifyButtonProps {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
  delay?: number;
}

// ============================================================================
// VerifyButton Component
// ============================================================================

const VerifyButton: React.FC<VerifyButtonProps> = React.memo(({
  onPress,
  disabled = false,
  label,
  delay = 0,
}) => {
  const { t } = useTranslation('auth');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.97, { duration: 100 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 150 });
  }, [scale]);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, scaleStyle]}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        style={[
          styles.verifyButton,
          {
            backgroundColor: disabled ? theme.borderLight : theme.primary,
            borderRadius: Radius.xl,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.lg,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: disabled ? 0 : 0.2,
            shadowRadius: 12,
            elevation: disabled ? 0 : 4,
          },
        ]}
      >
        <Text
          style={{
            color: disabled ? theme.textMuted : theme.onPrimary,
            fontSize: Typography.bodyMedium.fontSize,
            fontWeight: Typography.bodyMedium.fontWeight,
            lineHeight: Typography.bodyMedium.lineHeight,
          }}
        >
          {label || t('verifyOtp')}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

VerifyButton.displayName = 'VerifyButton';

// ============================================================================
// OtpInput Component
// ============================================================================

const OtpInput: React.FC<OtpInputProps> = React.memo(({
  value,
  onChangeText,
  error,
  delay = 0,
}) => {
  const { t } = useTranslation('auth');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const otpLength = 4;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleChangeText = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, otpLength);
    onChangeText(cleaned);
    if (cleaned.length < otpLength) {
      setFocusedIndex(cleaned.length);
    }
  }, [onChangeText]);

  const handleKeyPress = useCallback(({ nativeEvent }: { nativeEvent: { key: string } }) => {
    if (nativeEvent.key === 'Backspace' && value.length > 0) {
      const newValue = value.slice(0, -1);
      onChangeText(newValue);
      setFocusedIndex(Math.max(0, newValue.length));
    }
  }, [value, onChangeText]);

  const handleBoxPress = useCallback((index: number) => {
    setFocusedIndex(index);
    inputRef.current?.focus();
  }, []);

  return (
    <Animated.View style={animatedStyle}>
      <View style={{ marginBottom: Spacing.xs }}>
        <Text
          style={{
            fontSize: Typography.caption.fontSize,
            fontWeight: Typography.caption.fontWeight,
            lineHeight: Typography.caption.lineHeight,
            color: theme.textMuted,
            marginBottom: Spacing.md,
          }}
        >
          {t('enterOtp')}
        </Text>
      </View>

      {/* Hidden real input */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChangeText}
        onKeyPress={handleKeyPress}
        keyboardType="number-pad"
        maxLength={otpLength}
        accessibilityLabel="OTP input"
        accessibilityHint="Enter the 4 digit OTP sent to your mobile number"
        style={styles.hiddenInput}
      />

      {/* Visual OTP boxes */}
      <View style={styles.otpBoxesContainer}>
        {Array.from({ length: otpLength }).map((_, index) => {
          const isFilled = index < value.length;
          const isActive = index === focusedIndex || (index === value.length && focusedIndex === value.length);
          const isError = !!error;

          const borderColor = isError
            ? theme.error
            : isActive
              ? theme.primary
              : isFilled
                ? theme.primary
                : theme.border;

          const backgroundColor = isActive
            ? isDark ? theme.surface : theme.card
            : theme.input;

          return (
            <Pressable
              key={index}
              onPress={() => handleBoxPress(index)}
              accessibilityRole="button"
              accessibilityLabel={`OTP digit ${index + 1}`}
              style={[
                styles.otpBox,
                {
                  backgroundColor,
                  borderColor,
                  borderRadius: Radius.lg,
                  borderWidth: isActive ? 2 : 1,
                  shadowColor: theme.primary,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: isActive ? 0.08 : 0,
                  shadowRadius: 8,
                  elevation: isActive ? 2 : 0,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: Typography.h2.fontSize,
                  fontWeight: Typography.h2.fontWeight,
                  lineHeight: Typography.h2.lineHeight,
                  color: theme.text,
                }}
              >
                {isFilled ? value[index] : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error && (
        <Text
          style={{
            fontSize: Typography.small.fontSize,
            fontWeight: Typography.small.fontWeight,
            lineHeight: Typography.small.lineHeight,
            color: theme.error,
            marginTop: Spacing.xs,
            marginLeft: Spacing.sm,
          }}
        >
          {error}
        </Text>
      )}
    </Animated.View>
  );
});

OtpInput.displayName = 'OtpInput';

// ============================================================================
// VerifyOtpScreen Component
// ============================================================================

const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({
  phoneNumber,
  onVerify,
  onResend,
  onChangeNumber,
}) => {
  const { t } = useTranslation('auth');
  const colorScheme = useColorScheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { phone, reqId } = useLocalSearchParams();
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpLength = 4;

  // Entrance animation values
  const screenOpacity = useSharedValue(0);
  const screenTranslateY = useSharedValue(30);

  useEffect(() => {
    screenOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    screenTranslateY.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [screenOpacity, screenTranslateY]);

  const screenAnimatedStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
    transform: [{ translateY: screenTranslateY.value }],
  }));

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleVerify = useCallback(() => {
    if (otp.length !== otpLength) {
      setError(t('enterCompleteOtp'));
      return;
    }

    const phoneValue = typeof phone === 'string' ? phone : '';
    const reqIdValue = typeof reqId === 'string' ? reqId : '';

    if (!phoneValue || !reqIdValue) {
      setError(t('missingSession'));
      return;
    }

    setError('');

    verifyOtp({
      phone: phoneValue,
      otp,
      reqId: reqIdValue,
    },
      {
        onError: (err) => {
          const message = err.message || t('failedToVerify');
          setError(message);
        },
      }
    );

  }, [otp, phone, reqId, onVerify, verifyOtp]);

  const handleResend = useCallback(() => {
    if (!canResend) return;
    setOtp('');
    setError('');
    setCanResend(false);
    setResendTimer(30);
    onResend?.();
  }, [canResend, onResend]);

  const isValid = otp.length === otpLength;
  const displayPhone =
    typeof phone === 'string' && phone.length > 0
      ? phone
      : phoneNumber
        ? `+91${phoneNumber}`
        : '';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: theme.background }]}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >


        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, screenAnimatedStyle]}>
            {/* Top Section */}
            <View style={styles.topSection}>
              <AnimatedLogo delay={200} />
              <AnimatedHeading delay={400} />
              <AnimatedSubtitle delay={550} phoneNumber={displayPhone} />
            </View>

            {/* Middle Section */}
            <View style={styles.middleSection}>
              <OtpInput
                value={otp}
                onChangeText={(text) => {
                  setOtp(text);
                  if (error) setError('');
                }}
                error={error}
                delay={700}
              />

              <View style={{ marginVertical: Spacing.lg }} >
                <VerifyButton
                  onPress={handleVerify}
                  disabled={!isValid || isVerifying}
                  label={isVerifying ? t('verifying') : t('verifyOtp')}
                  delay={900}
                />
              </View>
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>


              <AnimatedResend
                delay={1100}
                canResend={canResend}
                timer={resendTimer}
                onResend={handleResend}
              />

              <AnimatedChangeNumber
                delay={1200}
                onChangeNumber={onChangeNumber ?? (() => router.back())}
              />

              <AnimatedSupport delay={1300} />
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ============================================================================
// Animated Sub-Components
// ============================================================================

const AnimatedLogo: React.FC<{ delay: number }> = React.memo(({ delay }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) })
    );
    scale.value = withDelay(
      delay,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) })
    );
  }, [delay, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.logoContainer, animatedStyle]}>
      <View
        style={[
          styles.logoCircle,
          {
            backgroundColor: theme.primaryLight,
            borderRadius: Radius.xxl,
            width: 72,
            height: 72,
          },
        ]}
      >
        <Text
          style={{
            fontSize: 32,
            color: theme.primary,
          }}
        >
          🔐
        </Text>
      </View>
    </Animated.View>
  );
});

AnimatedLogo.displayName = 'AnimatedLogo';

const AnimatedHeading: React.FC<{ delay: number }> = React.memo(({ delay }) => {
  const { t } = useTranslation('auth');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text
        style={{
          color: theme.text,
          fontSize: Typography.h1.fontSize,
          fontWeight: Typography.h1.fontWeight,
          lineHeight: Typography.h1.lineHeight,
          textAlign: 'center',
          marginBottom: Spacing.sm,
        }}
      >
        {t('verifyOtp')}
      </Text>
    </Animated.View>
  );
});

AnimatedHeading.displayName = 'AnimatedHeading';

const AnimatedSubtitle: React.FC<{ delay: number; phoneNumber: string }> = React.memo(
  ({ delay, phoneNumber }) => {
    const { t } = useTranslation('auth');
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = isDark ? Colors.dark : Colors.light;

    const opacity = useSharedValue(0);
    const translateY = useSharedValue(12);

    useEffect(() => {
      opacity.value = withDelay(
        delay,
        withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
      );
      translateY.value = withDelay(
        delay,
        withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
      );
    }, [delay, opacity, translateY]);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    }));

    return (
      <Animated.View style={animatedStyle}>
        <Text
          style={{
            color: theme.textSecondary,
            fontSize: Typography.body.fontSize,
            fontWeight: Typography.body.fontWeight,
            lineHeight: Typography.body.lineHeight,
            textAlign: 'center',
            paddingHorizontal: Spacing.md,
          }}
        >
          {t('otpSent')}
          <Text style={{ color: theme.text, fontWeight: '700' }}>
            {phoneNumber}
          </Text>
        </Text>
      </Animated.View>
    );
  }
);

AnimatedSubtitle.displayName = 'AnimatedSubtitle';

const AnimatedResend: React.FC<{
  delay: number;
  canResend: boolean;
  timer: number;
  onResend: () => void;
}> = React.memo(({ delay, canResend, timer, onResend }) => {
  const { t } = useTranslation('auth');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
    );
  }, [delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.resendContainer, animatedStyle]}>
      <Text
        style={{
          color: theme.textMuted,
          fontSize: Typography.small.fontSize,
          fontWeight: Typography.small.fontWeight,
          lineHeight: Typography.small.lineHeight,
          textAlign: 'center',
        }}
      >
        {t('didNotReceiveCode')}
        {canResend ? (
          <Text
            onPress={onResend}
            style={{ color: theme.primary, fontWeight: '600' }}
          >
            {t('resendOtp')}
          </Text>
        ) : (
          <Text style={{ color: theme.textMuted }}>
            {t('resendIn', { timer })}
          </Text>
        )}
      </Text>
    </Animated.View>
  );
});

AnimatedResend.displayName = 'AnimatedResend';

const AnimatedChangeNumber: React.FC<{
  delay: number;
  onChangeNumber?: () => void;
}> = React.memo(({ delay, onChangeNumber }) => {
  const { t } = useTranslation('auth');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
    );
  }, [delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.changeNumberContainer, animatedStyle]}>
      <TouchableOpacity
        onPress={onChangeNumber}
        accessibilityRole="button"
        accessibilityLabel={t('changeNumber')}
      >
        <Text
          style={{
            color: theme.primary,
            fontSize: Typography.small.fontSize,
            fontWeight: '600',
            lineHeight: Typography.small.lineHeight,
            textAlign: 'center',
          }}
        >
          {t('changeNumber')}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

AnimatedChangeNumber.displayName = 'AnimatedChangeNumber';

const AnimatedSupport: React.FC<{ delay: number }> = React.memo(({ delay }) => {
  const { t } = useTranslation('auth');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
    );
  }, [delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.supportContainer, animatedStyle]}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={t('needHelp')}
      >
        <Text
          style={{
            color: theme.textMuted,
            fontSize: Typography.small.fontSize,
            fontWeight: Typography.small.fontWeight,
            lineHeight: Typography.small.lineHeight,
          }}
        >
          {t('needHelp')}
          <Text style={{ color: theme.primary, fontWeight: '600' }}>
            {t('contactSupport')}
          </Text>
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

AnimatedSupport.displayName = 'AnimatedSupport';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoContainer: {
    marginBottom: Spacing.lg,
  },
  logoCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleSection: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  otpBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  otpBox: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
    maxHeight: 80,
  },
  bottomSection: {
    width: '100%',
  },
  verifyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  resendContainer: {
    marginTop: Spacing.lg,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  changeNumberContainer: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  supportContainer: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
});

export default VerifyOtpScreen;
export { OtpInput, VerifyButton };
