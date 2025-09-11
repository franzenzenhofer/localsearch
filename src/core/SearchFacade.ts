import type { SearchResult, SearchQuery } from './types.js'
import { MiniSearchEngine } from '../search/mini-search-engine.js'
import { createExtractors } from '../app/extractor-factory.js'
import { FileProcessor } from './FileProcessor.js'

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
        await this.processFile(file)
        this.fileCount++
      } catch (error) {
        this.handleError(file, error as Error)
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

  private async processFile(file: File): Promise<void> {
    const metadata = FileProcessor.createMetadata(file)
    const extractor = this.getExtractor(metadata.extension)
    const text = await FileProcessor.extractText(file, metadata, extractor)
    
    const document = FileProcessor.createDocument(metadata, text)
    await this.indexDocument(document, metadata)
  }

  private getExtractor(extension: string) {
    const extractor = this.extractors.get(extension)
    if (!extractor) {
      throw new Error(`Unsupported file type: ${extension}`)
    }
    return extractor
  }

  private async indexDocument(document: any, metadata: any): Promise<void> {
    this.searchEngine.setMetadata(metadata.id, metadata)
    await this.searchEngine.addDocuments([document])
  }

  private handleError(file: File, error: Error): void {
    this.config.onError?.(`Failed to process ${file.name}: ${error.message}`)
  }
}