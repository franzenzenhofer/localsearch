import type { FileMetadata, DocumentContent } from "../core/types";

export interface TextExtractor {
  supports(fileType: string): boolean;
  extract(file: File, metadata: FileMetadata): Promise<DocumentContent>;
}

export abstract class BaseExtractor implements TextExtractor {
  abstract supports(fileType: string): boolean;

  abstract extractText(
    buffer: ArrayBuffer,
    metadata: FileMetadata,
  ): Promise<string>;

  async extract(file: File, metadata: FileMetadata): Promise<DocumentContent> {
    const buffer = await file.arrayBuffer();
    const text = await this.extractText(buffer, metadata);

    return {
      id: crypto.randomUUID(),
      fileId: metadata.id,
      text: this.cleanText(text),
      metadata: {},
    };
  }

  protected cleanText(text: string): string {
    return text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n\s*\n/g, "\n\n")
      .replace(/^\s+|\s+$/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  protected detectEncoding(buffer: ArrayBuffer): string {
    // Simple UTF-8 detection
    const decoder = new TextDecoder("utf-8", { fatal: true });
    try {
      decoder.decode(buffer);
      return "utf-8";
    } catch {
      return "latin1";
    }
  }
}
