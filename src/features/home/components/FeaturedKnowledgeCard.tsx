import { Clock3, MessageSquareText, ThumbsUp, UsersRound } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, Text, View } from 'react-native';
import { useState } from 'react';

import { Colors } from '@/constants/theme';
import type { FeaturedPostResponse } from '../types/types';

const MAX_LENGTH = 150;

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

interface Props {
  data: FeaturedPostResponse['data'];
}

export default function FeaturedKnowledgeCard({ data }: Props) {
  const { t } = useTranslation('common');
  const c = Colors.light;
  const [expanded, setExpanded] = useState(false);
  const { post, postedBy } = data;

  const isLong = post.knowledge.length > MAX_LENGTH;
  const displayText = expanded || !isLong ? post.knowledge : `${post.knowledge.slice(0, MAX_LENGTH)}...`;

  const initials = postedBy.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View
      className="mt-4 overflow-hidden rounded-[24px] border p-5"
      style={{
        backgroundColor: '#F8D7BF',
        borderColor: 'rgba(143, 78, 0, 0.08)',
        shadowColor: '#79573F',
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 3,
      }}
    >
      <View className="flex-row items-start gap-3">
        <View className="h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white">
          {postedBy.avatar ? (
            <Image source={{ uri: postedBy.avatar }} className="h-full w-full" />
          ) : (
            <Text className="text-[12px] font-bold" style={{ color: c.primary }}>
              {initials}
            </Text>
          )}
        </View>

        <View className="flex-1">
          <Text className="text-[16px] font-bold" style={{ color: c.onSurface }}>
            {postedBy.name}
          </Text>
          <View className="mt-0.5 flex-row items-center gap-1.5">
            <Clock3 size={12} color={c.onSurfaceVariant} />
            <Text className="text-[11px] font-medium" style={{ color: c.onSurfaceVariant }}>
              {timeAgo(post.postedAt)}
            </Text>
          </View>
        </View>

        <View className="h-12 w-12 items-center justify-center rounded-full bg-white/40">
          <UsersRound size={20} color={c.primary} />
        </View>
      </View>

      <Text className="mt-4 text-[18px] leading-8" style={{ color: c.onSurface }}>
        &ldquo;{displayText}&rdquo;
      </Text>

      {isLong && (
        <Pressable onPress={() => setExpanded(!expanded)} className="mt-1">
          <Text className="text-[14px] font-semibold" style={{ color: c.primary }}>
            {expanded ? t('home.showLess') : t('home.readMore')}
          </Text>
        </Pressable>
      )}

      <View className="mt-4 flex-row items-center gap-5">
        <View className="flex-row items-center gap-1.5">
          <ThumbsUp size={18} color={c.onSurface} />
          <Text className="text-[13px] font-semibold" style={{ color: c.onSurface }}>
            {post.totalLikes}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <MessageSquareText size={18} color={c.onSurface} />
          <Text className="text-[13px] font-semibold" style={{ color: c.onSurface }}>
            {post.totalComments}
          </Text>
        </View>
      </View>
    </View>
  );
}
