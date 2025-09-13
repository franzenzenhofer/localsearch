import { describe, it, expect } from "vitest";
import {
  FileType,
  type FileMetadata,
  type SearchResult,
  type SearchQuery,
  type IndexingProgress,
} from "../../../src/core/types";

describe("Core Types", () => {
  describe("FileType enum", () => {
    it("should have all expected file types", () => {
      expect(FileType.PDF).toBe("pdf");
      expect(FileType.DOCX).toBe("docx");
      expect(FileType.TXT).toBe("txt");
      expect(FileType.MD).toBe("md");
      expect(FileType.CSV).toBe("csv");
      expect(FileType.HTML).toBe("html");
      expect(FileType.UNKNOWN).toBe("unknown");
    });
  });

  describe("FileMetadata interface", () => {
    it("should create valid FileMetadata object", () => {
      const metadata: FileMetadata = {
        id: "test-id",
        path: "/test/path.pdf",
        name: "test.pdf",
        extension: "pdf",
        size: 1024,
        lastModified: Date.now(),
        type: FileType.PDF,
        language: "en",
        hash: "hash123",
      };

      expect(metadata.id).toBe("test-id");
      expect(metadata.type).toBe(FileType.PDF);
    });
  });

  describe("SearchQuery interface", () => {
    it("should create valid SearchQuery object", () => {
      const query: SearchQuery = {
        text: "test query",
        limit: 10,
      };

      expect(query.text).toBe("test query");
      expect(query.limit).toBe(10);
    });
  });
});
