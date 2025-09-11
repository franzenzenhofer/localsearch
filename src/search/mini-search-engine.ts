import MiniSearch from 'minisearch';
import type { 
  DocumentContent, 
  SearchQuery, 
  SearchResult, 
  FileMetadata 
} from '../core/types';

export interface SearchEngine {
  addDocuments(documents: DocumentContent[]): Promise<void>;
  search(query: SearchQuery): Promise<SearchResult[]>;
  removeDocument(documentId: string): Promise<void>;
  clear(): Promise<void>;
}

export class MiniSearchEngine implements SearchEngine {
  private index: MiniSearch;
  private documents: Map<string, DocumentContent> = new Map();
  private metadata: Map<string, FileMetadata> = new Map();

  constructor() {
    this.index = new MiniSearch({
      fields: ['text'],
      storeFields: ['id', 'fileId'],
      searchOptions: {
        boost: { text: 2 },
        fuzzy: 0.2,
        prefix: true,
      },
    });
  }

  async addDocuments(documents: DocumentContent[]): Promise<void> {
    const searchDocs = documents.map(doc => ({
      id: doc.id,
      fileId: doc.fileId,
      text: doc.text,
    }));

    this.index.addAll(searchDocs);
    
    documents.forEach(doc => {
      this.documents.set(doc.id, doc);
    });
  }

  async search(query: SearchQuery): Promise<SearchResult[]> {
    const results = this.index.search(query.text);

    return results
      .slice(0, query.limit || 10)
      .map(result => ({
        fileId: result.fileId,
        score: result.score,
        snippets: this.generateSnippets(result.id, query.text),
        metadata: this.metadata.get(result.fileId)!,
      }));
  }

  async removeDocument(documentId: string): Promise<void> {
    this.index.discard(documentId);
    this.documents.delete(documentId);
  }

  async clear(): Promise<void> {
    this.index.removeAll();
    this.documents.clear();
    this.metadata.clear();
  }

  setMetadata(fileId: string, metadata: FileMetadata): void {
    this.metadata.set(fileId, metadata);
  }

  private generateSnippets(docId: string, queryText: string) {
    const doc = this.documents.get(docId);
    if (!doc) return [];

    const text = doc.text;
    const words = queryText.toLowerCase().split(/\s+/);
    const snippets = [];

    for (const word of words) {
      const index = text.toLowerCase().indexOf(word);
      if (index !== -1) {
        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + word.length + 50);
        
        snippets.push({
          text: text.slice(start, end),
          positions: [index],
          highlights: [{ start: index - start, end: index - start + word.length }],
        });
      }
    }

    return snippets.slice(0, 3);
  }
}