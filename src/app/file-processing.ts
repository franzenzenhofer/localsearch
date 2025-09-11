import type { TextExtractor as ITextExtractor } from '../extractors/base.js';
import type { FileMetadata } from '../core/types.js';
import { getFileTypeFromName, createFileMetadataWithType } from '../utils/file-utils.js';

export async function processFiles(
  files: File[], 
  extractors: Map<string, ITextExtractor>,
  onProgress?: (current: number, total: number) => void
): Promise<Array<{content: string, metadata: FileMetadata}>> {
  const results: Array<{content: string, metadata: FileMetadata}> = [];
  
  for (let i = 0; i < files.length; i++) {
    onProgress?.(i, files.length);
    try {
      const processed = await processFile(files[i], extractors);
      processed && results.push(processed);
    } catch (error) {
      console.error(`Failed to process ${files[i].name}:`, error);
    }
  }
  
  onProgress?.(files.length, files.length);
  return results;
}

export async function processFile(
  file: File,
  extractors: Map<string, ITextExtractor>
): Promise<{content: string, metadata: FileMetadata} | null> {
  const fileType = getFileTypeFromName(file.name);
  const extractor = extractors.get(fileType);
  
  if (!extractor) {
    console.warn(`No extractor for file type: ${fileType}`);
    return null;
  }

  const metadata = createFileMetadataWithType(file, fileType);
  const docContent = await extractor.extract(file, metadata);
  const content = docContent.text;
  
  return { content, metadata };
}

export function isValidFileType(fileName: string): boolean {
  const validTypes = ['pdf', 'docx', 'txt', 'md', 'csv', 'html'];
  const fileType = getFileTypeFromName(fileName);
  return validTypes.includes(fileType);
}

export function filterValidFiles(files: File[]): File[] {
  return files.filter(file => isValidFileType(file.name));
}