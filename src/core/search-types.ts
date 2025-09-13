import type { FileMetadata, FileTypeValue } from "./base-types";

export interface SearchResult {
  fileId: string;
  score: number;
  snippets: SearchSnippet[];
  metadata: FileMetadata;
}

export interface SearchSnippet {
  text: string;
  positions: number[];
  highlights: HighlightRange[];
}

export interface HighlightRange {
  start: number;
  end: number;
}

export interface SearchQuery {
  text: string;
  filters?: SearchFilters;
  limit?: number;
}

export interface SearchFilters {
  fileTypes?: FileTypeValue[];
  paths?: string[];
  languages?: string[];
  dateRange?: DateRange;
}

export interface DateRange {
  start: Date;
  end: Date;
}
