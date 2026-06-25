// app/knowledge/_components/sections/HeaderSection.tsx
import React from 'react';
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { PostButton } from './PostButton';

interface HeaderSectionProps {
  onBack: () => void;
  onPost: () => void;
  canPost: boolean;
  isSubmitting: boolean;
  colors: any;
  isDark: boolean;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  onBack,
  onPost,
  canPost,
  isSubmitting,
  colors,
  isDark,
}) => {
  return (
    <SafeAreaView style={{ backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, { borderBottomColor: colors.borderLight }]}>
        <Pressable
          onPress={onBack}
          style={[styles.backButton, { backgroundColor: colors.primaryMuted }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.backIcon, { color: colors.primary }]}>←</Text>
        </Pressable>

        <Text style={[styles.title, { color: colors.text }]}>New Post</Text>

        <PostButton
          onPress={onPost}
          disabled={!canPost}
          loading={isSubmitting}
          colors={colors}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    fontWeight: '700',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
});