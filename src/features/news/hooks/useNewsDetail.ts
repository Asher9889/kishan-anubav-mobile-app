import { useQuery } from '@tanstack/react-query';
import { fetchNewsById } from '../api/news.api';
import { NewsDetailData } from '../types/types';

interface UseNewsDetailReturn {
  data: NewsDetailData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useNewsDetail = (newsId: string): UseNewsDetailReturn => {


  const query  = useQuery({
    queryKey: ['newsDetail', newsId],
    queryFn: () => fetchNewsById(newsId),
    retry: false, 
  });

 return { data: query.data || null, loading: query.isLoading, error: query.error instanceof Error ? query.error.message : null, refetch: query.refetch};
};