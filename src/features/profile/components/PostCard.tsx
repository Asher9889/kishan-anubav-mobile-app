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

import { Colors } from '@/constants/theme';
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

const PostCard = ({ post }: Props) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;

  const styles = useMemo(
    () => createStyles(theme),
    [theme]
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {post.name.charAt(0)}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.name}>
            {post.name}
          </Text>

          <Text style={styles.location}>
            {post.location}, {post.state}
          </Text>
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

      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {post.likesCount} Likes
        </Text>

        <Text style={styles.statsText}>
          {post.commentsCount} Comments
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionButton}>
          <Heart size={20} color={theme.text} />
          <Text style={styles.actionText}>Like</Text>
        </Pressable>

        <Pressable style={styles.actionButton}>
          <MessageCircle size={20} color={theme.text} />
          <Text style={styles.actionText}>Comment</Text>
        </Pressable>

        <Pressable style={styles.actionButton}>
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
      backgroundColor: theme.background,
      marginBottom: 12,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },

    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#2E7D32',
      justifyContent: 'center',
      alignItems: 'center',
    },

    avatarText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },

    userInfo: {
      marginLeft: 12,
      flex: 1,
    },

    name: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },

    location: {
      marginTop: 2,
      fontSize: 13,
      color: theme.icon,
    },

    content: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.text,
      marginBottom: 12,
    },

    imageContainer: {
      marginBottom: 12,
    },

    image: {
      width: 320,
      height: 260,
      borderRadius: 10,
      marginRight: 8,
    },

    stats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },

    statsText: {
      color: theme.icon,
      fontSize: 13,
    },

    actions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 10,
    },

    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    actionText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '500',
    },
  });

export default PostCard;