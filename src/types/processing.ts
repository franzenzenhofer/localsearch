export interface ProcessingStatus {
  stage:
    | "idle"
    | "uploading"
    | "processing"
    | "indexing"
    | "complete"
    | "error";
  currentFile?: string;
  progress: number;
  totalFiles: number;
  processedFiles: number;
  errors: string[];
  logs: string[];
}

export interface ProcessingStats {
  processed: number;
  failed: number;
  totalSize: number;
  avgProcessingTime: number;
  startTime: number;
}

export interface SearchableDocument {
  id: string;
  filename: string;
  path: string;
  content: string;
  size: number;
  type: string;
  lastModified: number;
  searchableText: string;
}
