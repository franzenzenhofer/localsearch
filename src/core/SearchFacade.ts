import type { SearchResult, SearchQuery } from './types.js'

export interface SearchFacadeConfig {
  onProgress?: (current: number, total: number) => void
  onError?: (error: string) => void
}

export class SearchFacade {
  private documents: any[] = []
  private config: SearchFacadeConfig

  constructor(config: SearchFacadeConfig = {}) {
    this.config = config
  }

  async processFiles(files: File[], config: SearchFacadeConfig = {}): Promise<void> {
    const finalConfig = { ...this.config, ...config }
    this.documents = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      finalConfig.onProgress?.(i + 1, files.length)
      
      try {
        const text = await file.text()
        this.documents.push({
          id: crypto.randomUUID(),
          filename: file.name,
          path: (file as any).webkitRelativePath || file.name,
          content: text,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        })
      } catch (error) {
        finalConfig.onError?.(`Failed to process file: ${file.name}`)
      }
    }
  }

  search(query: SearchQuery): SearchResult[] {
    if (!query.text?.trim()) return []
    
    const searchTerm = query.text.toLowerCase()
    
    return this.documents
      .filter(doc => doc.content.toLowerCase().includes(searchTerm))
      .map(doc => ({
        id: doc.id,
        text: doc.content,
        score: Math.random() * 0.5 + 0.5, // Placeholder scoring
        metadata: {
          name: doc.filename,
          path: doc.path,
          size: doc.size,
          type: doc.type,
          lastModified: doc.lastModified,
          id: doc.id
        }
      }))
      .slice(0, 50) // Limit results
  }

  getDocumentCount(): number {
    return this.documents.length
  }

  clear(): void {
    this.documents = []
  }
}