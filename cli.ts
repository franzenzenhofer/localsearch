#!/usr/bin/env tsx
import { readFile, readdir, stat } from 'fs/promises';
import { join, extname } from 'path';
import { PDFExtractor } from './src/extractors/pdf.js';
import { DOCXExtractor } from './src/extractors/docx.js';
import { CSVExtractor } from './src/extractors/csv.js';
import { TextExtractor } from './src/extractors/text.js';
import { MiniSearchEngine } from './src/search/mini-search-engine.js';
import { FileMetadata } from './src/core/types.js';

class LocalSearchCLI {
  private searchEngine = new MiniSearchEngine();
  private documents: any[] = [];
  private extractors = {
    pdf: new PDFExtractor(),
    docx: new DOCXExtractor(),
    csv: new CSVExtractor(),
    txt: new TextExtractor(),
    md: new TextExtractor(),
    html: new TextExtractor()
  };

  async indexDirectory(dirPath: string): Promise<void> {
    console.log(`🔍 Indexing directory: ${dirPath}`);
    const files = await this.getAllFiles(dirPath);
    
    let indexed = 0;
    for (const filePath of files) {
      try {
        await this.indexFile(filePath);
        indexed++;
        if (indexed % 10 === 0) {
          console.log(`   Indexed ${indexed}/${files.length} files...`);
        }
      } catch (error) {
        console.warn(`   ⚠️  Failed to index ${filePath}: ${error}`);
      }
    }
    
    if (this.documents.length > 0) {
      await this.searchEngine.addDocuments(this.documents);
    }
    
    console.log(`✅ Indexed ${indexed}/${files.length} files successfully!`);
  }

  private async getAllFiles(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await readdir(dirPath);
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const stats = await stat(fullPath);
      
      if (stats.isDirectory()) {
        const subFiles = await this.getAllFiles(fullPath);
        files.push(...subFiles);
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  private async indexFile(filePath: string): Promise<void> {
    const ext = extname(filePath).toLowerCase().slice(1);
    const extractor = this.extractors[ext as keyof typeof this.extractors];
    
    if (!extractor) return;

    const buffer = await readFile(filePath);
    const metadata: FileMetadata = {
      name: filePath.split('/').pop()!,
      path: filePath,
      size: buffer.length,
      lastModified: new Date(),
      type: ext as any
    };

    const text = await extractor.extractText(buffer, metadata);
    
    this.searchEngine.setMetadata(filePath, metadata);
    
    this.documents.push({
      id: `${filePath}_chunk_0`,
      fileId: filePath,
      text: text
    });
  }

  async search(query: string): Promise<void> {
    console.log(`\n🔍 Searching for: "${query}"`);
    const start = Date.now();
    
    const results = await this.searchEngine.search({ text: query, limit: 10 });
    const duration = Date.now() - start;
    
    console.log(`\n📊 Found ${results.length} results in ${duration}ms\n`);
    
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.metadata.name}`);
      console.log(`   📁 ${result.metadata.path}`);
      console.log(`   📈 Score: ${result.score.toFixed(2)}`);
      if (result.snippets && result.snippets.length > 0) {
        console.log(`   💬 "${result.snippets[0].text}"`);
      }
      console.log('');
    });
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: tsx cli.ts <directory> <search-query>');
    process.exit(1);
  }

  const [directory, ...queryParts] = args;
  const query = queryParts.join(' ');

  const cli = new LocalSearchCLI();
  await cli.indexDirectory(directory);
  await cli.search(query);
}

main().catch(console.error);