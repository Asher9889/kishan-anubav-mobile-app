import type { ReactElement } from 'react';
import { memo, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Image } from 'expo-image';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Colors, Spacing, Typography } from '@/constants/theme';

import type { ProfileEmptyStateVariant, ProfilePost, ProfileTabKey } from '../types/profile.types';
import { EmptyPostsState } from './EmptyPostsState';

type AppTheme = typeof Colors.light;

type ProfilePostsGridProps = {
  theme: AppTheme;
  posts: ProfilePost[];
  activeTab: ProfileTabKey;
  headerComponent: ReactElement;
};

const AnimatedImage = Animated.createAnimatedComponent(Image);

const ProfilePostsGridComponent = ({ theme, posts, activeTab, headerComponent }: ProfilePostsGridProps) => {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const data = activeTab === 'posts' ? posts : [];

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => <PostTile theme={theme} post={item} index={index} styles={styles} />}
      ListHeaderComponent={headerComponent}
      ListEmptyComponent={<EmptyPostsState theme={theme} variant={activeTab as ProfileEmptyStateVariant} />}
      contentContainerStyle={styles.contentContainer}
      numColumns={3}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
      initialNumToRender={9}
      maxToRenderPerBatch={12}
      windowSize={5}
      removeClippedSubviews
      accessibilityLabel="Profile posts grid"
    />
  );
};

type PostTileProps = {
  theme: AppTheme;
  post: ProfilePost;
  index: number;
  styles: ReturnType<typeof createStyles>;
};

const PostTile = ({ theme, post, index, styles }: PostTileProps) => {
  const hasImage = Boolean(post.imageUri?.trim());
  return (
    <Animated.View entering={FadeInUp.delay(index * 45).duration(260)} style={styles.tileWrap}>
      <View style={styles.tile}>
        {hasImage ? (
          <AnimatedImage source={{ uri: post.imageUri ?? undefined }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={styles.placeholderTile}>
            <Text style={styles.placeholderText}>{post.title}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export const ProfilePostsGrid = memo(ProfilePostsGridComponent);

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    contentContainer: {
        paddingBottom: Spacing.xxl,
        gap: Spacing.xs,
    },
    columnWrapper: {
        gap: Spacing.xs,
    },
    tileWrap: {
        flex: 1,
    },
    tile: {
        aspectRatio: 1,
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: theme.surfaceContainerLow,
    },
    image: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    placeholderTile: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
        backgroundColor: theme.surfaceContainerLow,
    },
    placeholderText: {
      color: theme.textMuted,
      fontSize: Typography.small.fontSize,
      lineHeight: Typography.small.lineHeight,
      fontWeight: '700',
      textAlign: 'center',
    },
    
  });
