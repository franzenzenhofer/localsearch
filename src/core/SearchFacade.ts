import type { SearchResult, SearchQuery } from "./types";
import type { ProcessingStatus } from "../types/processing";
import { SearchEngine } from "./SearchEngine";
import { FileTextExtractor } from "./FileTextExtractor";
import { StatusManager, type StatusCallbacks } from "./StatusManager";

export interface SearchFacadeConfig extends StatusCallbacks {}

export class SearchFacade {
  private searchEngine = new SearchEngine();
  private statusManager: StatusManager;

  constructor(config: SearchFacadeConfig = {}) {
    this.statusManager = new StatusManager(config);
    this.statusManager.log("SearchFacade initialized");
  }

  async processFiles(files: File[]): Promise<void> {
    this.statusManager.initialize(files.length);

    const documents = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.statusManager.updateFile(file.name, i + 1, files.length);

      try {
        const text = await FileTextExtractor.extractText(file);
        const doc = FileTextExtractor.createSearchableDocument(file, text);
        documents.push(doc);
        this.statusManager.increment();
      } catch (error) {
        this.statusManager.error(`Failed to process ${file.name}: ${error}`);
      }
    }

    this.statusManager.stage("indexing", "Building search index...");
    this.searchEngine.addDocuments(documents);
    this.statusManager.complete(documents.length);
  }

  search(query: SearchQuery | string): SearchResult[] {
    const searchText = typeof query === "string" ? query : query.text;
    this.statusManager.log(`Searching for: "${searchText}"`);

    const results = this.searchEngine.search(query);
    this.statusManager.log(`Found ${results.length} matches`);
    return results;
  }

  getDocumentCount(): number {
    return this.searchEngine.getDocumentCount();
  }

  getProcessingStatus(): ProcessingStatus {
    return this.statusManager.getStatus();
  }

  clear(): void {
    this.searchEngine.clearDocuments();
    this.statusManager.reset();
    this.statusManager.log("Cleared");
  }
}
