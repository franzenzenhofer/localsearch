import type { StorageProvider } from './storage-interface';
import type { FileMetadata, DocumentContent, IndexingProgress } from '../core/types';
import { LocalSearchDB } from './dexie-db';

export class DexieStorageProvider implements StorageProvider {
  private db: LocalSearchDB;

  constructor() {
    this.db = new LocalSearchDB();
  }

  async saveFile(metadata: FileMetadata): Promise<void> {
    await this.db.files.put(metadata);
  }

  async saveDocument(content: DocumentContent): Promise<void> {
    await this.db.documents.put(content);
  }

  async getFile(id: string): Promise<FileMetadata | undefined> {
    return await this.db.files.get(id);
  }

  async getDocument(fileId: string): Promise<DocumentContent | undefined> {
    return await this.db.documents.where('fileId').equals(fileId).first();
  }

  async getAllFiles(): Promise<FileMetadata[]> {
    return await this.db.files.toArray();
  }

  async deleteFile(id: string): Promise<void> {
    await this.db.transaction('rw', this.db.files, this.db.documents, async () => {
      await this.db.files.delete(id);
      await this.db.documents.where('fileId').equals(id).delete();
    });
  }

  async clear(): Promise<void> {
    await this.db.transaction('rw', this.db.files, this.db.documents, async () => {
      await this.db.files.clear();
      await this.db.documents.clear();
    });
  }

  async saveProgress(progress: IndexingProgress): Promise<void> {
    await this.db.progress.put(progress);
  }

  async getLatestProgress(): Promise<IndexingProgress | undefined> {
    return await this.db.progress.orderBy('startTime').reverse().first();
  }
}