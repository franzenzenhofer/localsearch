import Dexie, { type Table } from 'dexie';
import type { 
  FileMetadata, 
  DocumentContent, 
  IndexingProgress 
} from '../core/types';

export class LocalSearchDB extends Dexie {
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