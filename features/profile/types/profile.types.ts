export type ProfileTabKey = 'posts' | 'activity' | 'saved';

export type ProfilePost = {
  id: string;
  imageUri?: string | null;
  title: string;
  caption: string;
};

export type ProfileStats = {
  posts: number;
  followers: number;
  following: number;
};

export type ProfileEmptyStateVariant = ProfileTabKey;
