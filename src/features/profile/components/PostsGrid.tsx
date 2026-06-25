import React, { useMemo } from 'react';
import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Camera } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_SIZE = (SCREEN_WIDTH - 2) / 3;

const MOCK_POSTS = [
  { id: '1', uri: 'https://picsum.photos/400/400?random=1', type: 'image' },
  { id: '2', uri: 'https://picsum.photos/400/400?random=2', type: 'image' },
  { id: '3', uri: 'https://picsum.photos/400/400?random=3', type: 'image' },
  { id: '4', uri: 'https://picsum.photos/400/400?random=4', type: 'image' },
  { id: '5', uri: 'https://picsum.photos/400/400?random=5', type: 'image' },
  { id: '6', uri: 'https://picsum.photos/400/400?random=6', type: 'image' },
  { id: '7', uri: 'https://picsum.photos/400/400?random=7', type: 'image' },
  { id: '8', uri: 'https://picsum.photos/400/400?random=8', type: 'image' },
  { id: '9', uri: 'https://picsum.photos/400/400?random=9', type: 'image' },
];

interface PostsGridProps {
  activeTab: 'grid' | 'reels' | 'tags';
}

const PostsGrid = ({ activeTab }: PostsGridProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  // If activeTab is reels or tags, we can display mock posts or filter, 
  // but let's keep the exact original behavior where MOCK_POSTS is rendered.
  return (
    <View style={styles.photoGrid}>
      {MOCK_POSTS.map((post, index) => (
        <Pressable key={post.id} style={styles.gridItem} accessibilityRole="button">
          <Image source={{ uri: post.uri }} style={styles.gridImage} contentFit="cover" />
          {index % 3 === 0 && (
            <View style={styles.gridOverlay}>
              <Camera size={16} color="#fff" />
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    photoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 1,
      paddingBottom: Spacing.xxl,
    },
    gridItem: {
      width: GRID_SIZE,
      height: GRID_SIZE,
      position: 'relative',
    },
    gridImage: {
      width: '100%',
      height: '100%',
    },
    gridOverlay: {
      position: 'absolute',
      top: 8,
      right: 8,
    },
  });

export default PostsGrid;
