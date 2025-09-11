import * as Comlink from 'comlink';
import type { 
  FileMetadata, 
  DocumentContent 
} from '../core/types.js';
import { MetadataGenerator } from './metadata-generator.js';
import { TextProcessors } from './text-processors.js';

export interface IndexingWorkerAPI {
  processFiles(files: File[]): Promise<ProcessingResult[]>;
  extractText(file: File, metadata: FileMetadata): Promise<DocumentContent>;
}

export interface ProcessingResult {
  metadata?: FileMetadata;
  content?: DocumentContent;
  error?: string;
}

export class IndexingWorkerClass implements IndexingWorkerAPI {
  private metadataGenerator = new MetadataGenerator();
  private textProcessor = new TextProcessors();

  async processFiles(files: File[]): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = [];
    
    for (const file of files) {
      try {
        const hash = await this.metadataGenerator.generateHash(file);
        const metadata = this.metadataGenerator.createMetadata(file, hash);
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
    const text = await this.textProcessor.extractTextContent(file, metadata.extension);
    
    return {
      id: crypto.randomUUID(),
      fileId: metadata.id,
      text,
      metadata: {},
    };
  }
}

Comlink.expose(new IndexingWorkerClass());