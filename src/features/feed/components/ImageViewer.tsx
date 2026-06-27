import { Image } from 'expo-image';
import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;
const { width: SW, height: SH } = Dimensions.get('window');

interface ImageViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageViewer({ images, initialIndex, onClose }: ImageViewerProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = createStyles(theme);
  const [index, setIndex] = useState(initialIndex);

  return (
    <Pressable style={styles.backdrop} onPress={onClose}>
      <Image
        source={{ uri: images[index] }}
        style={styles.image}
        contentFit="contain"
        transition={200}
      />
      {images.length > 1 && (
        <View style={styles.pagination}>
          <Text style={styles.pageText}>{index + 1} / {images.length}</Text>
        </View>
      )}
    </Pressable>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.92)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: SW,
      height: SH * 0.7,
    },
    pagination: {
      position: 'absolute',
      bottom: 60,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    pageText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '500',
    },
  });
