import type { ProfileEmptyStateVariant, ProfilePost, ProfileStats, ProfileTabKey } from '../types/profile.types';

export const PROFILE_TABS: Array<{ key: ProfileTabKey; label: string }> = [
  { key: 'posts', label: 'Posts' },
  { key: 'activity', label: 'Activity' },
  { key: 'saved', label: 'Saved' },
];

export const PROFILE_STATS: ProfileStats = {
  posts: 12,
  followers: 150,
  following: 89,
};

export const PROFILE_POSTS: ProfilePost[] = [
  {
    id: 'farm-update-1',
    imageUri: 'https://picsum.photos/seed/farm-soil/600/600',
    title: 'Soil prep update',
    caption: 'Healthy bed preparation before sowing.',
  },
  {
    id: 'farm-update-2',
    imageUri: 'https://picsum.photos/seed/farm-sprout/600/600',
    title: 'New sprouts',
    caption: 'Early growth after irrigation.',
  },
  {
    id: 'farm-update-3',
    imageUri: 'https://picsum.photos/seed/farm-harvest/600/600',
    title: 'Harvest day',
    caption: 'Packed and ready for market.',
  },
  {
    id: 'farm-update-4',
    imageUri: 'https://picsum.photos/seed/farm-greenhouse/600/600',
    title: 'Greenhouse check',
    caption: 'Monitoring humidity and crop health.',
  },
  {
    id: 'farm-update-5',
    imageUri: 'https://picsum.photos/seed/farm-irrigation/600/600',
    title: 'Irrigation flow',
    caption: 'Watering schedule completed.',
  },
  {
    id: 'farm-update-6',
    imageUri: 'https://picsum.photos/seed/farm-field/600/600',
    title: 'Field survey',
    caption: 'Planning the next planting cycle.',
  },
  {
    id: 'farm-update-7',
    imageUri: 'https://picsum.photos/seed/farm-tractor/600/600',
    title: 'Machinery day',
    caption: 'Preparing equipment for the season.',
  },
  {
    id: 'farm-update-8',
    imageUri: 'https://picsum.photos/seed/farm-market/600/600',
    title: 'Market stall',
    caption: 'Direct selling at the village market.',
  },
  {
    id: 'farm-update-9',
    imageUri: 'https://picsum.photos/seed/farm-dryland/600/600',
    title: 'Dryland check',
    caption: 'Tracking moisture and crop stress.',
  },
];

export const PROFILE_EMPTY_COPY: Record<ProfileEmptyStateVariant, { title: string; subtitle: string }> = {
  posts: {
    title: 'No posts yet',
    subtitle: 'Share your farming journey with the community.',
  },
  activity: {
    title: 'No activity yet',
    subtitle: 'Your interactions will appear here once you start engaging.',
  },
  saved: {
    title: 'Nothing saved yet',
    subtitle: 'Bookmark farming tips, posts, and expert advice for later.',
  },
};
