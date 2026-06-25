// components/news-detail/types.ts

export interface NewsDetailData {
  _id: { $oid: string };
  id: string;
  category: string;
  createdAt: string;
  fullDescription: string;
  htmlDescription: string;
  pdfUrl: string;
  publishDate: string;
  shortSummary: string;
  source: string;
  title: string;
  updatedAt: string;
  tag: string;
}

export interface NewsDetailScreenProps {
  newsId: string;
  onBackPress: () => void;
  fetchNewsById: (id: string) => Promise<NewsDetailData>;
  onShare?: (data: NewsDetailData) => void;
  onPdfOpen?: (url: string) => void;
}

export type RenderMode = 'clean' | 'original';