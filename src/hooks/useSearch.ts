import { useState, useCallback } from 'react';
import type { SearchResult } from '../core/types.js';
import { SearchFacade } from '../core/SearchFacade.js';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  
  const [searchFacade] = useState(() => new SearchFacade({
    onProgress: (current, total) => setProgress({ current, total }),
    onError: (error) => console.error('Search error:', error)
  }));

  const performSearch = useCallback(async () => {
    if (!query.trim() || fileCount === 0) return;
    
    setIsSearching(true);
    try {
      const searchResults = await searchFacade.search(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [query, fileCount, searchFacade]);

  const handleFileUpload = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    try {
      await searchFacade.processFiles(files, {
        onProgress: (current, total) => setProgress({ current, total }),
        onError: (error) => console.error('Processing error:', error)
      });
      setFileCount(searchFacade.getDocumentCount());
    } catch (error) {
      console.error('File indexing failed:', error);
    }
  }, [searchFacade]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    fileCount,
    progress,
    performSearch,
    handleFileUpload
  };
}