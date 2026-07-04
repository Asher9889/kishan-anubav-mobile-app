import React from 'react';
import { FlatList } from 'react-native';

import MarketPriceCard from './MarketPriceCard';

export interface MarketPrice {
  id: string;
  cropName: string;
  englishName: string;
  image: string;
  modalPrice: number;
  previousPrice: number;
  minPrice: number;
  maxPrice: number;
  trend: 'up' | 'down';
}

interface Props {
  data: MarketPrice[];
}

export default function MarketPriceCarousel({ data }: Props) {
  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 6,
      }}
      snapToInterval={296}
      decelerationRate="fast"
      renderItem={({ item }) => (
        <MarketPriceCard
          cropName={item.cropName}
          englishName={item.englishName}
          image={item.image}
          modalPrice={item.modalPrice}
          previousPrice={item.previousPrice}
          minPrice={item.minPrice}
          maxPrice={item.maxPrice}
          trend={item.trend}
        />
      )}
    />
  );
}