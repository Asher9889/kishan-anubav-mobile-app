import { useQuery } from '@tanstack/react-query';

import { getFeaturedKnowledge } from '../api/home.api';
import type { FeaturedPostResponse } from '../types/types';

export default function useFeaturedKnowledge() {
  return useQuery<FeaturedPostResponse>({
    queryKey: ['featuredKnowledge'],
    queryFn: getFeaturedKnowledge,
    staleTime: 5 * 60 * 1000,
  });
}
