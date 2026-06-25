export interface ApiResponse<T> {
  data: T;
}

export interface QueryAnalysis {
  raw_query?: string;
  farmer_name?: string | null;
  location?: string | null;
  district?: string | null;
  state?: string | null;
  crop?: string | null;
  season?: string | null;
  category?: string | null;
  problem?: string | null;
  solution?: string | null;
  summary?: string | null;
  language?: string;
  confidence_score?: number;
}

export interface SourceItem {
  farmer_name?: string;
  district?: string;
  state?: string;
  category?: string;
  crop?: string;
  finding?: string;
}

export interface FinalAnswer {
  answer: string;
  confidence: number;
  sources: SourceItem[];
  contexts_used: number;
}

export interface Transcription {
  transcript: string;
  language?: string;
  confidence?: number;
}

export interface KnowledgeIngestion {
  auto_ingested: boolean;
  message?: string | null;
}

export interface AskAudioResponseData {
  transcription: Transcription;
  query: string;
  analysis: QueryAnalysis;
  retrieved_count: number;
  best_match_score: number;
  top_sources: SourceItem[];
  contexts_used: number;
  answer: FinalAnswer;
  knowledge_ingestion: KnowledgeIngestion;
}

export type AskAudioApiResponse = ApiResponse<AskAudioResponseData>;