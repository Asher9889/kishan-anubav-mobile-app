import { useCallback, useMemo } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchFeed } from '../api/feed.api';
import type { FeedPost } from '../types/feed.types';

interface UseFeedReturn {
  posts: FeedPost[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

const PAGE_SIZE = 10;

export function useFeed(): UseFeedReturn {
  const query = useInfiniteQuery({
    queryKey: ['feed'],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) => fetchFeed({ cursor: pageParam, limit: PAGE_SIZE }),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  const posts = useMemo(() => query.data?.pages.flatMap((p) => p.posts) ?? [], [query.data]);

  const refresh = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const loadMore = useCallback(async () => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      await query.fetchNextPage();
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  return {
    posts,
    isLoading: query.isLoading,
    isRefreshing: query.isRefetching,
    isLoadingMore: query.isFetchingNextPage,
    hasMore: !!query.hasNextPage,
    error: query.error?.message ?? null,
    refresh,
    loadMore,
  };
}
