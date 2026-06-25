import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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


import { Images } from '@/assets';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loginSchema } from "../validation/login.schema";


interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  outline: string;
  input: string;
  card: string;
  error: string;
  errorLight: string;
  success: string;
  successLight: string;
  glow: string;
  icon: string;
}

interface AuthPhoneScreenProps {
  isPending?: boolean;
  onContinue?: (phoneNumber: string) => void;
}

interface ContinueButtonProps {
  isLoading: boolean;
  onPress: () => void;
  disabled?: boolean;
  label?: string;
  delay?: number;
}

const ContinueButton: React.FC<ContinueButtonProps> = React.memo(({
  isLoading,
  onPress,
  disabled = false,
  label = 'Continue',
  delay = 0,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme: ThemeColors = isDark ? Colors.dark : Colors.light;

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
          styles.continueButton,
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
          style={[
            styles.continueButtonText,
            {
              color: disabled ? theme.textMuted : theme.onPrimary,
              fontSize: Typography.bodyMedium.fontSize,
              fontWeight: Typography.bodyMedium.fontWeight,
              lineHeight: Typography.bodyMedium.lineHeight,
            },
          ]}
        >
          { isLoading ? 'Sending...' : label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

ContinueButton.displayName = 'ContinueButton';


// PhoneInput Component

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  delay?: number;
}

const PhoneInput: React.FC<PhoneInputProps> = React.memo(({
  value,
  onChangeText,
  error,
  delay = 0,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const [isFocused, setIsFocused] = useState(false);

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
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
    onChangeText(cleaned);
  }, [onChangeText]);

  const borderColor = error
    ? theme.error
    : isFocused
      ? theme.primary
      : theme.border;

  const backgroundColor = isFocused
    ? isDark ? theme.surface : theme.card
    : theme.input;

  return (
    <Animated.View style={animatedStyle}>
      <View style={{ marginBottom: Spacing.sm }}>
        <Text
          style={{
            fontSize: Typography.caption.fontSize,
            fontWeight: Typography.caption.fontWeight,
            lineHeight: Typography.caption.lineHeight,
            color: theme.textMuted,
            marginBottom: Spacing.xs,
          }}
        >
          Mobile Number
        </Text>
      </View>

      <View
        style={[
          styles.phoneInputContainer,
          {
            backgroundColor,
            borderColor,
            borderRadius: Radius.lg,
            borderWidth: isFocused ? 2 : 1,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isFocused ? 0.08 : 0,
            shadowRadius: 8,
            elevation: isFocused ? 2 : 0,
          },
        ]}
      >
        {/* Country Code Selector */}
        <View
          style={[
            styles.countryCodeContainer,
            {
              borderRightColor: theme.borderLight,
              paddingHorizontal: Spacing.md,
            },
          ]}
        >
          <Text
            style={{
              fontSize: Typography.body.fontSize,
              marginRight: Spacing.xs,
            }}
          >
            🇮🇳
          </Text>
          <Text
            style={{
              fontSize: Typography.body.fontSize,
              fontWeight: Typography.body.fontWeight,
              color: theme.textSecondary,
            }}
          >
            +91
          </Text>
        </View>

        {/* Phone Number Input */}
        <TextInput
          value={value}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="phone-pad"
          maxLength={10}
          placeholder="Enter mobile number"
          placeholderTextColor={theme.textMuted}
          accessibilityLabel="Mobile number input"
          accessibilityHint="Enter your 10 digit mobile number"
          style={[
            styles.phoneInput,
            {
              color: theme.text,
              fontSize: Typography.body.fontSize,
              fontWeight: Typography.body.fontWeight,
              paddingHorizontal: Spacing.md,
              paddingVertical: 0,
            },
          ]}
        />
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

PhoneInput.displayName = 'PhoneInput';

// ============================================================================
// AuthPhoneScreen Component
// ============================================================================

const AuthPhoneScreen: React.FC<AuthPhoneScreenProps> = ({ isPending, onContinue }) => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState('');

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

  const handleContinue = useCallback(() => {
    const result = loginSchema.safeParse(phoneNumber);

    if (!result.success) {
      setError(result.error.issues[0].message);

      return;
    }
    setError('');
    let formattedNumber = `+91${phoneNumber}`;
    onContinue?.(formattedNumber);
  }, [phoneNumber, onContinue]);

  const isValid = phoneNumber.length === 10;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : 'height'}
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
            {/* Logo Placeholder */}
            <AnimatedLogo delay={200} />

            {/* Welcome Headline */}
            <AnimatedHeading delay={400} />

            {/* Subtitle */}
            <AnimatedSubtitle delay={550} />
          </View>

          {/* Middle Section */}
          <View style={styles.middleSection}>
            <PhoneInput
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                if (error) setError('');
              }}
              error={error}
              delay={700}
            />

            <View style={{ marginTop: Spacing.xl }}>
              <ContinueButton
                isLoading={isPending ?? false}
                onPress={handleContinue}
                disabled={isPending}
                delay={900}
              />
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <AnimatedTerms delay={1100} />

            <AnimatedSupport delay={1200} />
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
            // backgroundColor: theme.primaryContainer,
            borderRadius: Radius.xxl,
            width: 72,
            height: 72,
          },
        ]}
      >
        <Image
          source={Images.logo}
          style={{ width: 120, height: 120 }}
          contentFit="contain"
        />
        {/* <Text
          style={{
            fontSize: 32,
            color: theme.primary,
          }}
        >
          🌾
        </Text> */}
      </View>
    </Animated.View>
  );
});

AnimatedLogo.displayName = 'AnimatedLogo';

const AnimatedHeading: React.FC<{ delay: number }> = React.memo(({ delay }) => {
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
        style={[
          styles.heading,
          {
            color: theme.text,
            fontSize: Typography.h1.fontSize,
            fontWeight: Typography.h1.fontWeight,
            lineHeight: Typography.h1.lineHeight,
          },
        ]}
      >
        Smart Farming Assistance
      </Text>
    </Animated.View>
  );
});

AnimatedHeading.displayName = 'AnimatedHeading';

const AnimatedSubtitle: React.FC<{ delay: number }> = React.memo(({ delay }) => {
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
        style={[
          styles.subtitle,
          {
            color: theme.textSecondary,
            fontSize: Typography.body.fontSize,
            fontWeight: Typography.body.fontWeight,
            lineHeight: Typography.body.lineHeight,
          },
        ]}
      >
        Get crop guidance, agricultural insights,{''}and AI support for your farm.
      </Text>
    </Animated.View>
  );
});

AnimatedSubtitle.displayName = 'AnimatedSubtitle';

const AnimatedTerms: React.FC<{ delay: number }> = React.memo(({ delay }) => {
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
    <Animated.View style={[styles.termsContainer, animatedStyle]}>
      <Text
        style={[
          styles.termsText,
          {
            color: theme.textMuted,
            fontSize: Typography.small.fontSize,
            fontWeight: Typography.small.fontWeight,
            lineHeight: Typography.small.lineHeight,
          },
        ]}
      >
        By continuing, you agree to our{' '}
        <Text style={{ color: theme.primary, fontWeight: '600' }}>
          Terms of Service
        </Text>{' '}
        and{' '}
        <Text style={{ color: theme.primary, fontWeight: '600' }}>
          Privacy Policy
        </Text>
      </Text>
    </Animated.View>
  );
});

AnimatedTerms.displayName = 'AnimatedTerms';

const AnimatedSupport: React.FC<{ delay: number }> = React.memo(({ delay }) => {
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
        accessibilityLabel="Get help and support"
      >
        <Text
          style={{
            color: theme.textMuted,
            fontSize: Typography.small.fontSize,
            fontWeight: Typography.small.fontWeight,
            lineHeight: Typography.small.lineHeight,
          }}
        >
          Need help?{' '}
          <Text style={{ color: theme.primary, fontWeight: '600' }}>
            Contact Support
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
  heading: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  middleSection: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    height: 56,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    height: '100%',
  },
  phoneInput: {
    flex: 1,
    height: '100%',
  },
  bottomSection: {
    width: '100%',
  },
  continueButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  continueButtonText: {
    textAlign: 'center',
  },
  termsContainer: {
    marginTop: Spacing.lg,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  termsText: {
    textAlign: 'center',
  },
  supportContainer: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
});

export default AuthPhoneScreen;
export { ContinueButton, PhoneInput };
