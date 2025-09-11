import type { FileMetadata, DocumentContent } from '../core/types';

export interface StorageProvider {
  saveFile(metadata: FileMetadata): Promise<void>;
  saveDocument(content: DocumentContent): Promise<void>;
  getFile(id: string): Promise<FileMetadata | undefined>;
  getDocument(fileId: string): Promise<DocumentContent | undefined>;
  getAllFiles(): Promise<FileMetadata[]>;
  deleteFile(id: string): Promise<void>;
  clear(): Promise<void>;
}