// SUPER DRY - MAXIMUM MODULARITY
// Reuses 100% of existing LocalSearch core code
import { PDFExtractor } from '../../src/extractors/pdf.js';
import { DOCXExtractor } from '../../src/extractors/docx.js';
import { CSVExtractor } from '../../src/extractors/csv.js';
import { TextExtractor } from '../../src/extractors/text.js';
import { MiniSearchEngine } from '../../src/search/mini-search-engine.js';
import type { FileMetadata, DocumentContent } from '../../src/core/types.js';

export class ExtensionSearchCore {
  private searchEngine = new MiniSearchEngine();
  private documents: DocumentContent[] = [];
  
  // DRY: Exact same extractors as PWA & CLI
  private extractors = {
    pdf: new PDFExtractor(),
    docx: new DOCXExtractor(), 
    csv: new CSVExtractor(),
    txt: new TextExtractor(),
    md: new TextExtractor(),
    html: new TextExtractor()
  };

  async indexFile(file: File): Promise<boolean> {
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const extractor = this.extractors[ext as keyof typeof this.extractors];
      
      if (!extractor) return false;

      const buffer = await file.arrayBuffer();
      const metadata: FileMetadata = {
        name: file.name,
        path: file.name,
        size: file.size,
        lastModified: new Date(file.lastModified),
        type: ext as any
      };

      const text = await extractor.extractText(buffer, metadata);
      
      this.searchEngine.setMetadata(file.name, metadata);
      this.documents.push({
        id: `${file.name}_chunk_0`,
        fileId: file.name,
        text: text
      });

      await this.searchEngine.addDocuments(this.documents.slice(-1));
      return true;
    } catch (error) {
      console.error(`Failed to index ${file.name}:`, error);
      return false;
    }
  }

  async search(query: string, limit = 10) {
    const results = await this.searchEngine.search({ text: query, limit });
    return results.map(result => ({
      title: result.metadata.name,
      path: result.metadata.path,
      score: result.score,
      snippet: result.snippets?.[0]?.text || '',
      metadata: result.metadata
    }));
  }

  getIndexedCount(): number {
    return this.documents.length;
  }

  async clear(): Promise<void> {
    await this.searchEngine.clear();
    this.documents = [];
  }
}