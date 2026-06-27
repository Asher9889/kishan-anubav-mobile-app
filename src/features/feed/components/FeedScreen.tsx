import { useCallback } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFeed } from '../hooks/useFeed';
import type { FeedPost } from '../types/feed.types';
import FeedEmptyState from './FeedEmptyState';
import FeedErrorState from './FeedErrorState';
import FeedHeader from './FeedHeader';
import FeedSkeleton from './FeedSkeleton';
import PostCard from './PostCard';

type AppTheme = typeof Colors.light;

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = createStyles(theme);
  const { posts, isLoading, isRefreshing, isLoadingMore, error, refresh, loadMore } = useFeed();

  const renderPost = useCallback(({ item }: { item: FeedPost }) => <PostCard post={item} />, []);

  const keyExtractor = useCallback((item: FeedPost) => item.id, []);

  if (isLoading && posts.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <FeedHeader />
        <FeedSkeleton />
      </SafeAreaView>
    );
  }

  if (error && posts.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <FeedHeader />
        <ScrollView
          contentContainerStyle={styles.scrollError}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={theme.primary} />
          }
        >
          <FeedErrorState onRetry={refresh} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FeedHeader />
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        onRefresh={refresh}
        refreshing={isRefreshing}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<FeedEmptyState />}
        ListFooterComponent={
          isLoadingMore ? <ActivityIndicator style={styles.loader} color={theme.primary} /> : null
        }
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.card,
    },
    list: {
      paddingBottom: Spacing.xxl,
    },
    separator: {
      height: 2,
      backgroundColor: theme.borderLight,
    },
    scrollError: {
      flexGrow: 1,
    },
    loader: {
      paddingVertical: Spacing.lg,
    },
  });
