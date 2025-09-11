import type { DocumentContent, SearchQuery, SearchResult } from '../core/types.js';

export interface SearchEngine {
  addDocuments(documents: DocumentContent[]): Promise<void>;
  search(query: SearchQuery): Promise<SearchResult[]>;
  removeDocument(documentId: string): Promise<void>;
  clear(): Promise<void>;
}

export interface SearchEngineConfig {
  fields: string[];
  storeFields: string[];
  searchOptions: SearchOptions;
}

export interface SearchOptions {
  boost?: Record<string, number>;
  fuzzy?: number;
  prefix?: boolean;
}