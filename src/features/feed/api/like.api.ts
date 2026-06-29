import { nodeApi } from '@/shared/api/axios';

export async function likePost(postId: string): Promise<void> {
  await nodeApi.request({
    url: `/posts/${postId}/likes`,
    method: 'POST',
  });
}

export async function unlikePost(postId: string): Promise<void> {
  await nodeApi.request({
    url: `/posts/${postId}/likes`,
    method: 'DELETE',
  });
}
