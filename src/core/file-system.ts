import type { FileMetadata } from './types';
import { FileType } from './types';

export interface FileSystemProvider {
  selectFolder(): Promise<FileSystemDirectoryHandle | null>;
  listFiles(handle: FileSystemDirectoryHandle): AsyncIterable<File>;
  readFile(file: File): Promise<ArrayBuffer>;
  isSupported(): boolean;
}

export class BrowserFileSystemProvider implements FileSystemProvider {
  isSupported(): boolean {
    return 'showDirectoryPicker' in window;
  }

  async selectFolder(): Promise<FileSystemDirectoryHandle | null> {
    if (!this.isSupported()) {
      throw new Error('File System Access API not supported');
    }
    
    try {
      return await window.showDirectoryPicker();
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return null;
      }
      throw error;
    }
  }

  async* listFiles(handle: FileSystemDirectoryHandle): AsyncIterable<File> {
    for await (const [_name, entry] of handle.entries()) {
      if (entry.kind === 'file') {
        const fileHandle = entry as FileSystemFileHandle;
        const file = await fileHandle.getFile();
        yield file;
      } else if (entry.kind === 'directory') {
        const dirHandle = entry as FileSystemDirectoryHandle;
        yield* this.listFiles(dirHandle);
      }
    }
  }

  async readFile(file: File): Promise<ArrayBuffer> {
    return await file.arrayBuffer();
  }
}

export async function generateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

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

function getFileType(extension: string): FileType {
  const typeMap: Record<string, FileType> = {
    pdf: FileType.PDF,
    docx: FileType.DOCX,
    txt: FileType.TXT,
    md: FileType.MD,
    csv: FileType.CSV,
    html: FileType.HTML,
  };
  
  return typeMap[extension] || FileType.UNKNOWN;
}