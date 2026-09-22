import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import AILogo from '@/components/ui/logo';
import { Colors, Spacing } from '@/constants/theme';
import { Text } from '@/components/ui/text';

/**
 * Hero shown when the current thread is empty (brand new chat).
 */
export default function WelcomeMessage() {
  const { t } = useTranslation('common');
  const c = Colors.light;

  return (
    <View style={styles.container}>
      <AILogo size={26} width={72} height={72} borderRadius={28} />

      <Text style={[styles.title, { color: c.text }]}>{t('appName')}</Text>

      <Text style={[styles.desc, { color: c.textMuted }]}>
        {t('chat.welcomeMessage')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: Spacing.lg,
  },

  title: {
    marginTop: Spacing.md,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },

  desc: {
    marginTop: Spacing.sm,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});