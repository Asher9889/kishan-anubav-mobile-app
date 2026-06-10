import React from 'react';
import { FlatList } from 'react-native';

import PostCard from '@/features/profile/components/PostCard';
import { Post } from '../types/profile.types';

interface Props {
  posts: Post[];
}

const PostsFeed = ({  posts }: Props) => {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PostCard post={item} />
      )}
    />
  );
};
     

export default PostsFeed;