import * as mammoth from "mammoth";
import { BaseExtractor } from "./base";
import type { FileMetadata } from "../core/types";

export class DOCXExtractor extends BaseExtractor {
  supports(fileType: string): boolean {
    return fileType === "docx";
  }

  async extractText(
    buffer: ArrayBuffer,
    _metadata: FileMetadata,
  ): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });

      // Log warnings if any
      if (result.messages.length > 0) {
        console.warn("DOCX extraction warnings:", result.messages);
      }

      return result.value || "";
    } catch (error) {
      throw new Error(`DOCX extraction failed: ${(error as Error).message}`);
    }
  }
}
