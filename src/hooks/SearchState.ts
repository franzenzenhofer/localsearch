import { useState } from "react";
import type { SearchResult } from "../core/types";
import type { ProcessingStatus } from "../types/processing";

export function useSearchState() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [showStatus, setShowStatus] = useState(false);

  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    stage: "idle",
    progress: 0,
    totalFiles: 0,
    processedFiles: 0,
    errors: [],
    logs: [],
  });

  return {
    query,
    setQuery,
    results,
    setResults,
    isSearching,
    setIsSearching,
    fileCount,
    setFileCount,
    progress,
    setProgress,
    showStatus,
    setShowStatus,
    processingStatus,
    setProcessingStatus,
  };
}
