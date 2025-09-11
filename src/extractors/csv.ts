import Papa from 'papaparse';
import { BaseExtractor } from './base';
import type { FileMetadata } from '../core/types';

export class CSVExtractor extends BaseExtractor {
  supports(fileType: string): boolean {
    return fileType === 'csv';
  }

  async extractText(buffer: ArrayBuffer, _metadata: FileMetadata): Promise<string> {
    try {
      const csvText = new TextDecoder(this.detectEncoding(buffer)).decode(buffer);
      const result = Papa.parse(csvText, {
        skipEmptyLines: true,
        transform: (value: string) => value.trim(),
      });
      
      if (result.errors.length > 0) {
        throw new Error(`Parse errors: ${result.errors.map((err: any) => err.message).join(', ')}`);
      }
      
      return result.data && result.data.length > 0 
        ? result.data
          .filter((row: any) => Array.isArray(row) && row.length > 0)
          .map((row: any) => row.join(' '))
          .join('\n')
        : '';
    } catch (error) {
      throw new Error(`CSV extraction failed: ${(error as Error).message}`);
    }
  }
}