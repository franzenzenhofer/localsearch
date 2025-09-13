import type { FileMetadata, DocumentContent } from "./types.js";
import { UniversalExtractor } from "../extractors/universal";
import { ImageExtractor } from "../extractors/image";

export class FileProcessor {
  static createMetadata(file: File): FileMetadata {
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    return {
      id: crypto.randomUUID(),
      path: file.webkitRelativePath || file.name,
      name: file.name,
      extension,
      size: file.size,
      lastModified: file.lastModified,
      type: extension as any,
      hash: "",
    };
  }

  static createDocument(metadata: FileMetadata, text: string): DocumentContent {
    return {
      id: metadata.id,
      fileId: metadata.id,
      text,
      metadata: {},
    };
  }

  static async extractText(
    file: File,
    metadata: FileMetadata,
  ): Promise<string> {
    const extension = `.${metadata.extension}`;

    // Use ImageExtractor for image files
    if (ImageExtractor.supportedExtensions.includes(extension)) {
      const imageExtractor = new ImageExtractor();
      return await imageExtractor.extract(file);
    }

    // Use UniversalExtractor for all other files
    const universalExtractor = new UniversalExtractor();
    return await universalExtractor.extract(file);
  }
}
