import type { FileMetadata, FileTypeValue } from '../core/types';
import { FileType } from '../core/base-types';

/**
 * Gets the file type based on extension
 */
export function getFileType(extension: string): FileTypeValue {
  const typeMap: Record<string, FileTypeValue> = {
    pdf: FileType.PDF,
    docx: FileType.DOCX,
    txt: FileType.TXT,
    md: FileType.MD,
    csv: FileType.CSV,
    html: FileType.HTML,
  };
  
  return typeMap[extension] || FileType.UNKNOWN;
}

/**
 * Gets the file type from filename (with extension parsing)
 */
export function getFileTypeFromName(fileName: string): string {
  const parts = fileName.split('.');
  if (parts.length <= 1) return 'unknown';
  return parts.pop()?.toLowerCase() || 'unknown';
}

/**
 * Creates file metadata from File object with hash
 */
export function createFileMetadata(file: File, hash: string): FileMetadata {
  const parts = file.name.split('.');
  const extension = parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
  
  return {
    id: crypto.randomUUID(),
    path: file.webkitRelativePath || file.name,
    name: file.name,
    extension,
    size: file.size,
    lastModified: file.lastModified,
    type: getFileType(extension),
    hash,
  };
}

/**
 * Creates file metadata from File object with file type string
 */
export function createFileMetadataWithType(file: File, fileType: string): FileMetadata {
  return {
    id: crypto.randomUUID(),
    path: file.webkitRelativePath || file.name,
    name: file.name,
    extension: getFileTypeFromName(file.name),
    size: file.size,
    lastModified: file.lastModified,
    type: fileType as FileTypeValue,
    hash: '',
  };
}

/**
 * Generates SHA-256 hash for a file
 */
export async function generateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}