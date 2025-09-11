import * as Comlink from 'comlink';
import type { 
  FileMetadata, 
  DocumentContent 
} from '../core/types';

export interface IndexingWorkerAPI {
  processFiles(files: File[]): Promise<ProcessingResult[]>;
  extractText(file: File, metadata: FileMetadata): Promise<DocumentContent>;
}

export interface ProcessingResult {
  metadata?: FileMetadata;
  content?: DocumentContent;
  error?: string;
}

class IndexingWorker implements IndexingWorkerAPI {
  async processFiles(files: File[]): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = [];
    
    for (const file of files) {
      try {
        const hash = await this.generateHash(file);
        const metadata = this.createMetadata(file, hash);
        const content = await this.extractText(file, metadata);
        
        results.push({ metadata, content });
      } catch (error) {
        results.push({ 
          error: `Failed to process ${file.name}: ${(error as Error).message}` 
        });
      }
    }
    
    return results;
  }

  async extractText(file: File, metadata: FileMetadata): Promise<DocumentContent> {
    const buffer = await file.arrayBuffer();
    let text = '';

    switch (metadata.extension) {
      case 'txt':
      case 'md':
        text = new TextDecoder().decode(buffer);
        break;
      case 'html':
        text = this.extractFromHtml(new TextDecoder().decode(buffer));
        break;
      default:
        throw new Error(`Unsupported file type: ${metadata.extension}`);
    }

    return {
      id: this.generateId(),
      fileId: metadata.id,
      text: this.cleanText(text),
      metadata: {},
    };
  }

  private async generateHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private createMetadata(file: File, hash: string): FileMetadata {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    return {
      id: this.generateId(),
      path: file.webkitRelativePath || file.name,
      name: file.name,
      extension,
      size: file.size,
      lastModified: file.lastModified,
      type: this.getFileType(extension) as any,
      hash,
    };
  }

  private getFileType(extension: string) {
    const typeMap: Record<string, string> = {
      pdf: 'pdf', docx: 'docx', txt: 'txt',
      md: 'md', csv: 'csv', html: 'html',
    };
    return typeMap[extension] || 'unknown';
  }

  private extractFromHtml(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body?.textContent || doc.textContent || '';
  }

  private cleanText(text: string): string {
    return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  }

  private generateId(): string {
    return crypto.randomUUID();
  }
}

Comlink.expose(new IndexingWorker());