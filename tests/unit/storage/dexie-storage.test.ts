import { describe, it, expect, vi, beforeEach } from "vitest";
import type { FileMetadata, DocumentContent } from "../../../src/core/types";
import { FileType } from "../../../src/core/types";

// Create a mock storage provider that follows the same interface
class MockStorageProvider {
  private files = new Map<string, FileMetadata>();
  private documents = new Map<string, DocumentContent>();

  async saveFile(metadata: FileMetadata): Promise<void> {
    this.files.set(metadata.id, metadata);
  }

  async saveDocument(content: DocumentContent): Promise<void> {
    this.documents.set(content.id, content);
  }

  async getFile(id: string): Promise<FileMetadata | undefined> {
    return this.files.get(id);
  }

  async getDocument(fileId: string): Promise<DocumentContent | undefined> {
    for (const doc of this.documents.values()) {
      if (doc.fileId === fileId) {
        return doc;
      }
    }
    return undefined;
  }

  async getAllFiles(): Promise<FileMetadata[]> {
    return Array.from(this.files.values());
  }

  async deleteFile(id: string): Promise<void> {
    this.files.delete(id);
    // Also delete associated documents
    for (const [docId, doc] of this.documents) {
      if (doc.fileId === id) {
        this.documents.delete(docId);
      }
    }
  }

  async clear(): Promise<void> {
    this.files.clear();
    this.documents.clear();
  }
}

describe("StorageProvider Interface", () => {
  let storage: MockStorageProvider;
  let sampleFile: FileMetadata;
  let sampleDocument: DocumentContent;

  beforeEach(() => {
    storage = new MockStorageProvider();

    sampleFile = {
      id: "file-1",
      path: "test.txt",
      name: "test.txt",
      extension: "txt",
      size: 100,
      lastModified: Date.now(),
      type: FileType.TXT,
      hash: "hash123",
    };

    sampleDocument = {
      id: "doc-1",
      fileId: "file-1",
      text: "Sample document content",
      metadata: {},
    };
  });

  describe("file operations", () => {
    it("should save and retrieve file metadata", async () => {
      await storage.saveFile(sampleFile);
      const retrieved = await storage.getFile("file-1");

      expect(retrieved).toEqual(sampleFile);
    });

    it("should return undefined for non-existent file", async () => {
      const result = await storage.getFile("non-existent");

      expect(result).toBeUndefined();
    });

    it("should get all files", async () => {
      await storage.saveFile(sampleFile);
      const files = await storage.getAllFiles();

      expect(files).toHaveLength(1);
      expect(files[0]).toEqual(sampleFile);
    });

    it("should delete file and associated documents", async () => {
      await storage.saveFile(sampleFile);
      await storage.saveDocument(sampleDocument);

      await storage.deleteFile("file-1");

      const file = await storage.getFile("file-1");
      const document = await storage.getDocument("file-1");

      expect(file).toBeUndefined();
      expect(document).toBeUndefined();
    });
  });

  describe("document operations", () => {
    it("should save and retrieve document content", async () => {
      await storage.saveDocument(sampleDocument);
      const retrieved = await storage.getDocument("file-1");

      expect(retrieved).toEqual(sampleDocument);
    });

    it("should return undefined for non-existent document", async () => {
      const result = await storage.getDocument("non-existent");

      expect(result).toBeUndefined();
    });
  });

  describe("bulk operations", () => {
    it("should clear all data", async () => {
      await storage.saveFile(sampleFile);
      await storage.saveDocument(sampleDocument);

      await storage.clear();

      const files = await storage.getAllFiles();
      const document = await storage.getDocument("file-1");

      expect(files).toHaveLength(0);
      expect(document).toBeUndefined();
    });

    it("should handle multiple files and documents", async () => {
      const file2: FileMetadata = {
        ...sampleFile,
        id: "file-2",
        name: "test2.txt",
      };
      const doc2: DocumentContent = {
        ...sampleDocument,
        id: "doc-2",
        fileId: "file-2",
      };

      await storage.saveFile(sampleFile);
      await storage.saveFile(file2);
      await storage.saveDocument(sampleDocument);
      await storage.saveDocument(doc2);

      const files = await storage.getAllFiles();
      expect(files).toHaveLength(2);

      const doc1 = await storage.getDocument("file-1");
      const doc2Retrieved = await storage.getDocument("file-2");

      expect(doc1).toEqual(sampleDocument);
      expect(doc2Retrieved).toEqual(doc2);
    });
  });
});
