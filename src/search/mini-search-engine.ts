import MiniSearch from "minisearch";
import type {
  DocumentContent,
  FileMetadata,
  SearchQuery,
  SearchResult,
} from "../core/types";
import { generateSnippets, createDefaultMetadata } from "./mini-search-helpers";

export class MiniSearchEngine {
  private miniSearch: MiniSearch;
  private documents: Map<string, DocumentContent> = new Map();
  private metadata: Map<string, FileMetadata> = new Map();

  constructor() {
    this.miniSearch = new MiniSearch({
      fields: ["text"],
      storeFields: ["id", "fileId", "text"],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
        boost: { text: 1 },
      },
    });
  }

  async addDocuments(documents: DocumentContent[]): Promise<void> {
    for (const doc of documents) {
      this.documents.set(doc.id, doc);
    }
    this.miniSearch.addAll(documents);
  }

  async removeDocument(documentId: string): Promise<void> {
    this.documents.delete(documentId);
    this.miniSearch.discard(documentId);
  }

  async search(query: SearchQuery): Promise<SearchResult[]> {
    const results = this.miniSearch.search(query.text, {
      limit: query.limit,
      fuzzy: 0.2,
      prefix: true,
    });

    return results.map((result) => {
      const doc = this.documents.get(result.id);
      const fileMetadata = this.metadata.get(doc?.fileId || "");

      return {
        fileId: doc?.fileId || "",
        score: result.score,
        snippets: generateSnippets(doc?.text || "", query.text),
        metadata: fileMetadata || createDefaultMetadata(),
      };
    });
  }

  setMetadata(fileId: string, metadata: FileMetadata): void {
    this.metadata.set(fileId, metadata);
  }

  async clear(): Promise<void> {
    this.documents.clear();
    this.metadata.clear();
    this.miniSearch.removeAll();
  }
}
