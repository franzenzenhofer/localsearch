import { BaseExtractor } from './base';
import type { FileMetadata } from '../core/types';

export class TextExtractor extends BaseExtractor {
  supports(fileType: string): boolean {
    return ['txt', 'md', 'html'].includes(fileType);
  }

  async extractText(buffer: ArrayBuffer, metadata: FileMetadata): Promise<string> {
    const encoding = this.detectEncoding(buffer);
    const decoder = new TextDecoder(encoding);
    let text = decoder.decode(buffer);

    if (metadata.extension === 'html') {
      text = this.extractFromHtml(text);
    }

    return text;
  }

  private extractFromHtml(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body?.textContent || doc.textContent || '';
  }
}