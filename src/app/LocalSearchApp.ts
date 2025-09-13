import { MiniSearchEngine } from "../search/mini-search-engine";
import type { DocumentContent } from "../core/types";

export class LocalSearchApp {
  private searchEngine: MiniSearchEngine;
  private isInitialized = false;

  constructor() {
    this.searchEngine = new MiniSearchEngine();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;
  }

  async addFiles(files: File[]): Promise<void> {
    const documents: DocumentContent[] = [];

    for (const file of files) {
      const text = await file.text();
      const doc: DocumentContent = {
        id: crypto.randomUUID(),
        fileId: file.name,
        text,
        metadata: { size: file.size, type: file.type },
      };
      documents.push(doc);
    }

    await this.searchEngine.addDocuments(documents);
  }

  async search(query: string) {
    return this.searchEngine.search({ text: query });
  }

  async clear() {
    await this.searchEngine.clear();
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}
