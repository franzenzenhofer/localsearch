import type { SearchableDocument } from "../types/processing";

export class FileTextExtractor {
  static async extractText(file: File): Promise<string> {
    // Simulate processing delay for better UX
    await new Promise((resolve) => window.setTimeout(resolve, 100));

    if (file.type.startsWith("text/")) {
      return await file.text();
    }

    if (file.type === "application/pdf") {
      return await file.text(); // Simplified - would use PDF.js in real impl
    }

    if (file.type.includes("image/")) {
      return `Image: ${file.name} (${file.size} bytes)`;
    }

    return await file.text();
  }

  static createSearchableDocument(
    file: File,
    text: string,
  ): SearchableDocument {
    return {
      id: crypto.randomUUID(),
      filename: file.name,
      path: (file as any).webkitRelativePath || file.name,
      content: text,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      searchableText: text.toLowerCase().trim(),
    };
  }
}
