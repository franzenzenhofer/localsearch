import { describe, it, expect, vi, beforeEach } from "vitest";
import { TextExtractor } from "../../../src/extractors/text";
import type { FileMetadata } from "../../../src/core/types";
import { FileType } from "../../../src/core/types";

// Mock crypto for tests
Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: vi.fn().mockReturnValue("test-uuid"),
  },
});

describe("TextExtractor", () => {
  let extractor: TextExtractor;

  beforeEach(() => {
    extractor = new TextExtractor();
  });

  describe("supports", () => {
    it("should support txt files", () => {
      expect(extractor.supports("txt")).toBe(true);
    });

    it("should support md files", () => {
      expect(extractor.supports("md")).toBe(true);
    });

    it("should support html files", () => {
      expect(extractor.supports("html")).toBe(true);
    });

    it("should not support pdf files", () => {
      expect(extractor.supports("pdf")).toBe(false);
    });
  });

  describe("extract", () => {
    it("should extract text from txt file", async () => {
      const content = "Hello, world!\nThis is a test.";
      const file = new File([content], "test.txt");
      const metadata: FileMetadata = {
        id: "file-1",
        path: "test.txt",
        name: "test.txt",
        extension: "txt",
        size: content.length,
        lastModified: Date.now(),
        type: FileType.TXT,
        hash: "hash123",
      };

      const result = await extractor.extract(file, metadata);

      expect(result.fileId).toBe("file-1");
      expect(result.text).toBe(content);
    });

    it("should extract text from HTML", async () => {
      const html = "<html><body><h1>Title</h1><p>Content</p></body></html>";
      const file = new File([html], "test.html");
      const metadata: FileMetadata = {
        id: "file-2",
        path: "test.html",
        name: "test.html",
        extension: "html",
        size: html.length,
        lastModified: Date.now(),
        type: FileType.HTML,
        hash: "hash456",
      };

      const result = await extractor.extract(file, metadata);

      expect(result.text).toContain("Title");
      expect(result.text).toContain("Content");
      expect(result.text).not.toContain("<h1>");
    });
  });
});
