import type { SearchResult, SearchQuery } from "./types";
import type { SearchableDocument } from "../types/processing";

export class SearchEngine {
  private documents: SearchableDocument[] = [];

  addDocuments(docs: SearchableDocument[]): void {
    this.documents.push(...docs);
  }

  clearDocuments(): void {
    this.documents = [];
  }

  getDocumentCount(): number {
    return this.documents.length;
  }

  search(query: SearchQuery | string): SearchResult[] {
    const searchText = typeof query === "string" ? query : query.text;

    if (!searchText?.trim()) return [];

    const searchTerm = searchText.toLowerCase().trim();

    return this.documents
      .filter((doc) => doc.searchableText.includes(searchTerm))
      .map((doc) => this.createSearchResult(doc, searchTerm));
  }

  private createSearchResult(
    doc: SearchableDocument,
    searchTerm: string,
  ): SearchResult {
    const searchIndex = doc.content.toLowerCase().indexOf(searchTerm);
    let snippet = doc.content;

    if (searchIndex !== -1 && doc.content.length > 200) {
      const start = Math.max(0, searchIndex - 50);
      const end = Math.min(doc.content.length, searchIndex + 150);
      snippet = doc.content.substring(start, end);
      if (start > 0) snippet = "..." + snippet;
      if (end < doc.content.length) snippet = snippet + "...";
    }

    return {
      id: doc.id,
      fileId: doc.id,
      score: 1,
      snippets: [
        {
          text: snippet,
          positions: [searchIndex],
          highlights: [
            {
              start: Math.max(0, searchIndex - 50),
              end: Math.min(snippet.length, searchIndex + searchTerm.length),
            },
          ],
        },
      ],
      metadata: {
        id: doc.id,
        filename: doc.filename,
        path: doc.path,
        size: doc.size,
        type: doc.type,
        lastModified: doc.lastModified,
        extension: doc.filename.split(".").pop()?.toLowerCase() || "",
        hash: "hash-" + doc.id.substring(0, 8),
      },
    };
  }
}
