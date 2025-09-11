import type { SearchResult, SearchQuery, DocumentContent, FileMetadata } from './types.js'
import { MiniSearchEngine } from '../search/mini-search-engine.js'
import { createExtractors } from '../app/extractor-factory.js'

export interface SearchFacadeConfig {
  onProgress?: (current: number, total: number) => void
  onError?: (error: string) => void
}

export class SearchFacade {
  private searchEngine = new MiniSearchEngine()
  private extractors = createExtractors()
  private fileCount = 0
  private config: SearchFacadeConfig

  constructor(config: SearchFacadeConfig = {}) {
    this.config = config
  }

  async indexFiles(files: File[]): Promise<void> {
    const total = files.length
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      this.config.onProgress?.(i + 1, total)
      
      try {
        await this.processAndIndexFile(file)
        this.fileCount++
      } catch (error) {
        this.config.onError?.(`Failed to process ${file.name}: ${(error as Error).message}`)
      }
    }
    
    this.config.onProgress?.(0, 0)
  }

  async search(queryText: string, limit = 20): Promise<SearchResult[]> {
    if (!queryText.trim()) return []
    
    const query: SearchQuery = { text: queryText, limit }
    return await this.searchEngine.search(query)
  }

  getFileCount(): number {
    return this.fileCount
  }

  async clear(): Promise<void> {
    await this.searchEngine.clear()
    this.fileCount = 0
  }

  private async processAndIndexFile(file: File): Promise<void> {
    await this.extractAndIndex(file)
  }

  private async extractAndIndex(file: File): Promise<void> {
    const metadata = this.createMetadata(file)
    const extractor = this.getExtractor(metadata.extension)
    const extractedText = await this.extractText(file, metadata, extractor)
    
    const document = this.createDocument(metadata, extractedText)
    await this.indexDocument(document, metadata)
  }

  private createMetadata(file: File): FileMetadata {
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    return {
      id: crypto.randomUUID(),
      path: file.webkitRelativePath || file.name,
      name: file.name,
      extension,
      size: file.size,
      lastModified: file.lastModified,
      type: extension as any,
      hash: ''
    }
  }

  private getExtractor(extension: string) {
    const extractor = this.extractors.get(extension)
    if (!extractor) {
      throw new Error(`Unsupported file type: ${extension}`)
    }
    return extractor
  }

  private async extractText(file: File, metadata: FileMetadata, extractor: any): Promise<string> {
    const result = await extractor.extract(file, metadata)
    return typeof result === 'string' ? result : result.text
  }

  private createDocument(metadata: FileMetadata, text: string): DocumentContent {
    return {
      id: metadata.id,
      fileId: metadata.id,
      text,
      metadata: {}
    }
  }

  private async indexDocument(document: DocumentContent, metadata: FileMetadata): Promise<void> {
    this.searchEngine.setMetadata(metadata.id, metadata)
    await this.searchEngine.addDocuments([document])
  }
}