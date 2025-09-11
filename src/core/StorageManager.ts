import type { FileMetadata } from './types.js'

export interface StoredIndex {
  id: string
  name: string
  created: number
  fileCount: number
  metadata: FileMetadata[]
  searchData: any
}

export class StorageManager {
  private static readonly STORAGE_KEY = 'localsearch_indexes'

  static async saveIndex(index: StoredIndex): Promise<void> {
    const indexes = this.getIndexes()
    const existing = indexes.findIndex(i => i.id === index.id)
    
    if (existing >= 0) {
      indexes[existing] = index
    } else {
      indexes.push(index)
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(indexes))
  }

  static getIndexes(): StoredIndex[] {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  static deleteIndex(id: string): void {
    const indexes = this.getIndexes().filter(i => i.id !== id)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(indexes))
  }

  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  static exportIndex(id: string): string | null {
    const index = this.getIndexes().find(i => i.id === id)
    return index ? JSON.stringify(index, null, 2) : null
  }

  static importIndex(jsonData: string): StoredIndex {
    const index = JSON.parse(jsonData)
    index.id = crypto.randomUUID()
    this.saveIndex(index)
    return index
  }
}