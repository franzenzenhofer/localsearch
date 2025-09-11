import { BrowserFileSystemProvider } from '../core/file-system.js';
import { DexieStorageProvider } from '../storage/dexie-storage.js';
import { MiniSearchEngine } from '../search/mini-search-engine.js';
import type { TextExtractor as ITextExtractor } from '../extractors/base.js';
import { createExtractors } from './extractor-factory.js';

export class AppCore {
  public fileSystemProvider: BrowserFileSystemProvider;
  public storageProvider: DexieStorageProvider;
  public searchEngine: MiniSearchEngine;
  public extractors: Map<string, ITextExtractor>;
  public indexedFileCount = 0;

  constructor() {
    this.fileSystemProvider = new BrowserFileSystemProvider();
    this.storageProvider = new DexieStorageProvider();
    this.searchEngine = new MiniSearchEngine();
    this.extractors = createExtractors();
  }

  async addDocument(data: {
    id: string;
    title: string;
    content: string;
    path: string;
    lastModified: Date;
    size: number;
  }): Promise<void> {
    await this.searchEngine.addDocument(data);
    this.indexedFileCount++;
  }

  async search(query: string, options = { limit: 20 }) {
    return await this.searchEngine.search({ text: query, limit: options.limit });
  }

  getIndexedCount(): number {
    return this.indexedFileCount;
  }
}