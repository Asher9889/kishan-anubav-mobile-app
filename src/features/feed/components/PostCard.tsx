import { useMemo, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { FeedPost } from '../types/feed.types';
import AuthorSection from './AuthorSection';
import EngagementSummary from './EngagementSummary';
import FeedActionBar from './FeedActionBar';
import ImageGrid from './ImageGrid';
import ImageViewer from './ImageViewer';
import PostContent from './PostContent';

type AppTheme = typeof Colors.light;

interface PostCardProps {
  post: FeedPost;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onAuthorPress?: () => void;
}

export default function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

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
          <EngagementSummary likesCount={post.likesCount || 0} commentsCount={post.commentsCount || 0} />
          <FeedActionBar onLike={onLike} onComment={onComment} onShare={onShare} />
        </View>
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
  });
