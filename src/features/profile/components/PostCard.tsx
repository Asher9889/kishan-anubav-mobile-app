import { Image } from 'expo-image';
import {
  Heart,
  MessageCircle,
  Share2,
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

export interface Post {
  id: string;
  userId: string;
  name: string;
  location: string;
  state: string;
  district: string;
  knowledge: string;
  images: string[];
  likesCount: number;
  commentsCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  post: Post;
}

function timeAgo(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diff = Math.max(0, now - date);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

const PostCard = ({ post }: Props) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;

  const styles = useMemo(
    () => createStyles(theme),
    [theme]
  );

  const initial = post.name?.trim()?.charAt(0)?.toUpperCase() ?? '?';
  const locationParts = [post.location, post.state].filter(Boolean);
  const locationText = locationParts.length > 0 ? locationParts.join(', ') : null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {post.name}
          </Text>

          {locationText && (
            <Text style={styles.location} numberOfLines={1}>
              {locationText}
            </Text>
          )}
        </View>
      </View>

      <Text style={styles.content}>
        {post.knowledge}
      </Text>

      {post.images.length > 0 && (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageContainer}
        >
          {post.images.map((image, index) => (
            <Image
              key={`${post.id}-${index}`}
              source={{ uri: image }}
              style={styles.image}
              contentFit="cover"
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.meta}>
        <Text style={styles.metaText}>
          {post.likesCount} likes
        </Text>
        <View style={styles.metaRight}>
          <Text style={styles.metaText}>
            {post.commentsCount} comments
          </Text>
          {post.createdAt && (
            <>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>
                {timeAgo(post.createdAt)}
              </Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
        >
          <Heart size={20} color={theme.text} />
          <Text style={styles.actionText}>Like</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
        >
          <MessageCircle size={20} color={theme.text} />
          <Text style={styles.actionText}>Comment</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
        >
          <Share2 size={20} color={theme.text} />
          <Text style={styles.actionText}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      marginBottom: Spacing.sm,
      padding: Spacing.md,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: theme.border,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },

    avatar: {
      width: 44,
      height: 44,
      borderRadius: Radius.full,
      backgroundColor: theme.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },

    avatarText: {
      color: theme.onSecondary,
      fontSize: Typography.h3.fontSize,
      fontWeight: '600',
    },

    userInfo: {
      marginLeft: Spacing.sm,
      flex: 1,
    },

    name: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: '600',
      color: theme.text,
    },

    location: {
      marginTop: 2,
      fontSize: Typography.caption.fontSize,
      color: theme.textSecondary,
    },

    content: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: theme.text,
      marginBottom: Spacing.sm,
    },

    imageContainer: {
      marginBottom: Spacing.sm,
    },

    image: {
      width: 320,
      height: 260,
      borderRadius: Radius.md,
      marginRight: Spacing.sm,
    },

    meta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },

    metaText: {
      color: theme.textSecondary,
      fontSize: Typography.caption.fontSize,
    },

    metaRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },

    metaDot: {
      color: theme.textMuted,
      fontSize: Typography.caption.fontSize,
    },

    actions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: Spacing.sm,
    },

    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.sm,
    },

    actionButtonPressed: {
      opacity: 0.6,
    },

    actionText: {
      color: theme.text,
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: '500',
    },
  });

export default PostCard;
