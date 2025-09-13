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
