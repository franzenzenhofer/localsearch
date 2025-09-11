import type { FileMetadata, DocumentContent } from './types.js'

export class FileProcessor {
  static createMetadata(file: File): FileMetadata {
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

  static createDocument(metadata: FileMetadata, text: string): DocumentContent {
    return {
      id: metadata.id,
      fileId: metadata.id,
      text,
      metadata: {}
    }
  }

  static async extractText(file: File, metadata: FileMetadata, extractor: any): Promise<string> {
    const result = await extractor.extract(file, metadata)
    return typeof result === 'string' ? result : result.text
  }
}