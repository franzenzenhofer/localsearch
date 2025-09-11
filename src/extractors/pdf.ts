import * as pdfjsLib from 'pdfjs-dist';
import { BaseExtractor } from './base';
import type { FileMetadata } from '../core/types';

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  '//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.269/pdf.worker.min.js';

export class PDFExtractor extends BaseExtractor {
  supports(fileType: string): boolean {
    return fileType === 'pdf';
  }

  async extractText(buffer: ArrayBuffer, _metadata: FileMetadata): Promise<string> {
    try {
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const textParts: string[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str || '').join('');
        pageText.trim() && textParts.push(pageText);
      }

      return textParts.join('\n\n');
    } catch (error) {
      throw new Error(`PDF extraction failed: ${(error as Error).message}`);
    }
  }
}