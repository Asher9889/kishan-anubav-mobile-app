import { endPoints } from '@/shared/api';
import { nodeApi } from '@/shared/api/axios';
import { feedResponseSchema } from '../types/feed.schema';
import type { FeedPost, FeedQueryParams } from '../types/feed.types';

export async function fetchFeed(params: FeedQueryParams): Promise<{ posts: FeedPost[]; nextCursor: string | null; hasMore: boolean }> {
  const { url, method } = endPoints.FEED.GET;
  const body = await nodeApi.request({
    url,
    method,
    params: { cursor: params.cursor ?? undefined, limit: params.limit },
  });

  const parsed = feedResponseSchema.parse(body);
  return parsed.data;
}
