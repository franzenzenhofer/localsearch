import type { SearchResult, SearchQuery, DocumentContent, FileMetadata } from './types.js';
import { MiniSearchEngine } from '../search/mini-search-engine.js';
import { createExtractors } from '../app/extractor-factory.js';

export interface SearchFacadeConfig {
  onProgress?: (current: number, total: number) => void;
  onError?: (error: string) => void;
}

export class SearchFacade {
  private searchEngine = new MiniSearchEngine();
  private extractors = createExtractors();
  private fileCount = 0;
  private config: SearchFacadeConfig;

  constructor(config: SearchFacadeConfig = {}) {
    this.config = config;
  }

  async indexFiles(files: File[]): Promise<void> {
    const total = files.length;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.config.onProgress?.(i + 1, total);
      
      try {
        await this.processAndIndexFile(file);
        this.fileCount++;
      } catch (error) {
        this.config.onError?.(`Failed to process ${file.name}: ${(error as Error).message}`);
      }
    }
    
    this.config.onProgress?.(0, 0); // Reset progress
  }

  async search(queryText: string, limit = 20): Promise<SearchResult[]> {
    if (!queryText.trim()) return [];
    
    const query: SearchQuery = { text: queryText, limit };
    return await this.searchEngine.search(query);
  }

  getFileCount(): number {
    return this.fileCount;
  }

  async clear(): Promise<void> {
    await this.searchEngine.clear();
    this.fileCount = 0;
  }

  private async processAndIndexFile(file: File): Promise<void> {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const extractor = this.extractors.get(extension);
    
    if (!extractor) {
      throw new Error(`Unsupported file type: ${extension}`);
    }

    const metadata: FileMetadata = {
      id: crypto.randomUUID(),
      path: file.webkitRelativePath || file.name,
      name: file.name,
      extension,
      size: file.size,
      lastModified: file.lastModified,
      type: extension as any,
      hash: await this.generateHash(file)
    };

    const extractedText = await extractor.extract(file, metadata);
    
    const document: DocumentContent = {
      id: metadata.id,
      fileId: metadata.id,
      text: extractedText,
      metadata: {}
    };

    this.searchEngine.setMetadata(metadata.id, metadata);
    await this.searchEngine.addDocuments([document]);
  }

  private async generateHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}