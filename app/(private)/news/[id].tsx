import { fetchNewsById } from '@/features/news/api/news.api';
import NewsDetailScreen from '@/features/news/screen/NewsDetailScreen';
import { useNavigation } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function NewsDetailRoute() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  return (
    <NewsDetailScreen
      newsId={id as string}
      onBackPress={() => navigation.goBack()}
      fetchNewsById={fetchNewsById}
      onShare={(data) => {
        // Custom share logic
        console.log('Sharing:', data.title);
      }}
      onPdfOpen={(url) => {
        router.push({
          pathname: "/news/pdf-viewer",
          params: {
            pdfUrl: url,
          },
        });
      }}
    />
  );
}