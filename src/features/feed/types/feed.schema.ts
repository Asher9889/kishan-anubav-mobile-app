import { z } from 'zod';

export const feedPostSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  location: z.string(),
  state: z.string(),
  district: z.string(),
  knowledge: z.string(),
  images: z.array(z.string()),
  likesCount: z.number(),
  commentsCount: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const feedResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: z.string().optional(),
  data: z.object({
    posts: z.array(feedPostSchema),
    nextCursor: z.string().nullable(),
    hasMore: z.boolean(),
  }),
});

export const feedQueryParamsSchema = z.object({
  limit: z.number().optional().default(10),
  cursor: z.string().optional().nullable().default(null),
});

export type FeedPost = z.infer<typeof feedPostSchema>;
export type FeedResponse = z.infer<typeof feedResponseSchema>;
export type FeedQueryParams = z.infer<typeof feedQueryParamsSchema>;
