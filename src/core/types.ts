export interface FileMetadata {
  id: string;
  path: string;
  name: string;
  extension: string;
  size: number;
  lastModified: number;
  type: FileType;
  language?: string;
  hash: string;
}

export interface DocumentContent {
  id: string;
  fileId: string;
  text: string;
  metadata: Record<string, unknown>;
}

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

export const FileType = {
  PDF: 'pdf',
  DOCX: 'docx',
  TXT: 'txt',
  MD: 'md',
  CSV: 'csv',
  HTML: 'html',
  UNKNOWN: 'unknown',
} as const;

export type FileType = typeof FileType[keyof typeof FileType];

export interface SearchQuery {
  text: string;
  filters?: SearchFilters;
  limit?: number;
}

export interface SearchFilters {
  fileTypes?: FileType[];
  paths?: string[];
  languages?: string[];
  dateRange?: DateRange;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface IndexingProgress {
  totalFiles: number;
  processedFiles: number;
  currentFile: string;
  errors: IndexingError[];
  startTime: number;
}

export interface IndexingError {
  filePath: string;
  error: string;
  timestamp: number;
}