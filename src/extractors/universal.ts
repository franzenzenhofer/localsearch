import { BaseExtractor } from './base'
import { addFileMetadata } from './core'
import { supportedExtensions } from './universal/extensions'
import { isTextFile, isArchive, isStructuredData, extractText, extractArchive, extractStructuredData } from './universal/processors'

export class UniversalExtractor extends BaseExtractor {
  static supportedExtensions = supportedExtensions

  async extract(file: File): Promise<string> {
    const extension = this.getFileExtension(file.name)
    
    try {
      if (isTextFile(extension)) {
        return await extractText(file)
      }
      
      if (isArchive(extension)) {
        return await extractArchive(file)
      }
      
      if (isStructuredData(extension)) {
        return await extractStructuredData(file)
      }
      
      return await extractText(file)
      
    } catch (error) {
      return addFileMetadata(file, `Failed to extract content: ${error}`)
    }
  }
}