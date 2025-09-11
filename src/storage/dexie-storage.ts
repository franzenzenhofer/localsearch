import Dexie, { type Table } from 'dexie';
import type { 
  FileMetadata, 
  DocumentContent, 
  IndexingProgress 
} from '../core/types';

export interface StorageProvider {
  saveFile(metadata: FileMetadata): Promise<void>;
  saveDocument(content: DocumentContent): Promise<void>;
  getFile(id: string): Promise<FileMetadata | undefined>;
  getDocument(fileId: string): Promise<DocumentContent | undefined>;
  getAllFiles(): Promise<FileMetadata[]>;
  deleteFile(id: string): Promise<void>;
  clear(): Promise<void>;
}

class LocalSearchDB extends Dexie {
  files!: Table<FileMetadata>;
  documents!: Table<DocumentContent>;
  progress!: Table<IndexingProgress>;

  constructor() {
    super('LocalSearchDB');
    
    this.version(1).stores({
      files: 'id, path, name, type, lastModified, hash',
      documents: 'id, fileId, text',
      progress: '++id, startTime',
    });
  }
}

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