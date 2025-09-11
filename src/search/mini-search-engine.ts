import MiniSearch from 'minisearch';
import type { DocumentContent, SearchQuery, SearchResult, FileMetadata } from '../core/types.js';
import { createSearchOptions, formatSearchDocument } from './search-helpers.js';
import type { SearchEngine } from './search-engine-interface.js';
import { DocumentManager } from './document-manager.js';
export class MiniSearchEngine implements SearchEngine {
  private index: MiniSearch;
  private documentManager = new DocumentManager();

  constructor() {
    this.index = new MiniSearch({
      fields: ['text'],
      storeFields: ['id', 'fileId'],
      searchOptions: createSearchOptions(),
    });
  }

  async addDocuments(documents: DocumentContent[]): Promise<void> {
    const searchDocs = documents.map(formatSearchDocument);
    this.index.addAll(searchDocs);
    this.documentManager.addDocuments(documents);
  }

  async search(query: SearchQuery): Promise<SearchResult[]> {
    const results = this.index.search(query.text);

    return results
      .slice(0, query.limit || 10)
      .map(result => ({
        fileId: result.fileId,
        score: result.score,
        snippets: this.documentManager.getSnippets(result.id, query.text),
        metadata: this.documentManager.getMetadata(result.fileId)!,
      }));
  }

  async removeDocument(documentId: string): Promise<void> {
    this.index.discard(documentId);
    this.documentManager.removeDocument(documentId);
  }

  async clear(): Promise<void> {
    this.index.removeAll();
    this.documentManager.clear();
  }

  setMetadata(fileId: string, metadata: FileMetadata): void {
    this.documentManager.setMetadata(fileId, metadata);
  }

  async addDocument(data: {
    id: string; title: string; content: string; path: string; 
    lastModified: Date; size: number;
  }): Promise<void> {
    const doc: DocumentContent = { 
      id: data.id, 
      fileId: data.id, 
      text: data.content,
      metadata: {}
    };
    const metadata: FileMetadata = {
      id: data.id,
      name: data.title, 
      path: data.path, 
      extension: data.title.split('.').pop() || 'unknown',
      size: data.size,
      lastModified: data.lastModified.getTime(),
      type: 'unknown' as any,
      hash: crypto.randomUUID()
    };
    
    this.setMetadata(data.id, metadata);
    await this.addDocuments([doc]);
  }
}