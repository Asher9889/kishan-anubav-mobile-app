import { useMemo, useState, useRef } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Heart } from 'lucide-react-native';

import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLike } from '../hooks/useLike';
import type { FeedPost } from '../types/feed.types';
import AuthorSection from './AuthorSection';
import FeedActionBar from './FeedActionBar';
import ImageGrid from './ImageGrid';
import ImageViewer from './ImageViewer';
import PostContent from './PostContent';

type AppTheme = typeof Colors.light;

interface PostCardProps {
  post: FeedPost;
  onComment?: () => void;
  onShare?: () => void;
}

export default function PostCard({ post, onComment, onShare }: PostCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [showHeart, setShowHeart] = useState(false);
  const likeMutation = useLike();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLike = () => {
    const wasLiked = post.isLiked;
    likeMutation.mutate({ postId: post.id, currentlyLiked: wasLiked });
    if (!wasLiked) {
      setShowHeart(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShowHeart(false), 600);
    }
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.paddedSection}>
          <AuthorSection
            userId={post.userId}
            name={post.name}
            location={post.location}
            state={post.state}
            district={post.district}
            createdAt={post.createdAt}
          />

          <PostContent text={post.knowledge} />
        </View>

        {post.images.length > 0 && (
          <ImageGrid images={post.images} onImagePress={(i) => setViewerIndex(i)} />
        )}

        <View style={styles.paddedSection}>
          <FeedActionBar
            isLiked={post.isLiked}
            isLiking={likeMutation.isPending}
            likesCount={post.likesCount}
            commentsCount={post.commentsCount}
            onLike={handleLike}
            onComment={onComment}
            onShare={onShare}
          />
        </View>

        {showHeart && (
          <View style={styles.heartOverlay} pointerEvents="none">
            <Heart size={64} color={theme.red} fill={theme.red} />
          </View>
        )}
      </View>

      {viewerIndex != null && (
        <Modal transparent visible={!!viewerIndex} onRequestClose={() => setViewerIndex(null)}>
          <ImageViewer images={post.images} initialIndex={viewerIndex} onClose={() => setViewerIndex(null)} />
        </Modal>
      )}
    </>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      marginVertical: Spacing.xl,
    },
    paddedSection: {
      paddingHorizontal: Spacing.md,
    },
    heartOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
