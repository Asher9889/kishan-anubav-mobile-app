// app/knowledge/_components/sections/ImageSection.tsx
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { PostImage } from '../types/knowledge.types';
import { ImagePreviewCard } from './ImagePreviewCard';
import { UploadPlaceholder } from './UploadPlaceholder';

interface ImageSectionProps {
  images: PostImage[];
  maxImages: number;
  onAddPress: () => void;
  onRemove: (id: string) => void;
  colors: any;
  typography: any;
}

export const ImageSection: React.FC<ImageSectionProps> = ({
  images,
  maxImages,
  onAddPress,
  onRemove,
  colors,
  typography,
}) => {
  const renderItem = ({ item, index }: { item: PostImage; index: number }) => (
    <ImagePreviewCard
      image={item}
      index={index}
      onRemove={onRemove}
      colors={colors}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textMuted, ...typography.caption }]}>
        Photos {images.length > 0 && `(${images.length}/${maxImages})`}
      </Text>

      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        ListFooterComponent={
          images.length < maxImages ? (
            <UploadPlaceholder
              onPress={onAddPress}
              remaining={maxImages - images.length}
              colors={colors}
            />
          ) : null
        }
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  label: {
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
});