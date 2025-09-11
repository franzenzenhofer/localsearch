import type { DocumentContent, FileMetadata } from '../core/types.js';
import { generateSnippets } from './search-helpers.js';

export class DocumentManager {
  private documents = new Map<string, DocumentContent>();
  private metadata = new Map<string, FileMetadata>();

  addDocuments(documents: DocumentContent[]): void {
    documents.forEach(doc => {
      this.documents.set(doc.id, doc);
    });
  }

  setMetadata(fileId: string, metadata: FileMetadata): void {
    this.metadata.set(fileId, metadata);
  }

  getSnippets(docId: string, queryText: string) {
    const doc = this.documents.get(docId);
    return doc ? generateSnippets(doc.text, queryText) : [];
  }

  getMetadata(fileId: string): FileMetadata | undefined {
    return this.metadata.get(fileId);
  }

  removeDocument(documentId: string): void {
    this.documents.delete(documentId);
  }

  clear(): void {
    this.documents.clear();
    this.metadata.clear();
  }
}