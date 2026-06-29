import { useMutation, useQueryClient } from '@tanstack/react-query';

import { likePost, unlikePost } from '../api/like.api';
import type { FeedPost } from '../types/feed.types';

export function useLike() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ postId, currentlyLiked }: { postId: string; currentlyLiked: boolean }) => {
      if (currentlyLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    },
    onMutate: async ({ postId, currentlyLiked }) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });

      const previousData = queryClient.getQueriesData({ queryKey: ['feed'] });

      queryClient.setQueriesData({ queryKey: ['feed'] }, (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        const pages = (old as { pages: { posts: FeedPost[] }[] }).pages;
        if (!pages) return old;

        return {
          ...(old as Record<string, unknown>),
          pages: pages.map((page) => ({
            ...page,
            posts: page.posts.map((post: FeedPost) =>
              post.id === postId
                ? {
                    ...post,
                    isLiked: !currentlyLiked,
                    likesCount: post.likesCount + (currentlyLiked ? -1 : 1),
                  }
                : post,
            ),
          })),
        };
      });

      return { previousData };
    },
    onError: (_err, { postId, currentlyLiked }, context) => {
      if (context?.previousData) {
        for (const [key, data] of context.previousData) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  return mutation;
}
