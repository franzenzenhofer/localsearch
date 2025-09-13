export { createFileMetadata, generateFileHash } from "../utils/file-utils";

export interface FileSystemProvider {
  selectFolder(): Promise<FileSystemDirectoryHandle | null>;
  listFiles(handle: FileSystemDirectoryHandle): AsyncIterable<File>;
  readFile(file: File): Promise<ArrayBuffer>;
  isSupported(): boolean;
}

export class BrowserFileSystemProvider implements FileSystemProvider {
  isSupported(): boolean {
    return "showDirectoryPicker" in window;
  }

  async selectFolder(): Promise<FileSystemDirectoryHandle | null> {
    if (!this.isSupported()) {
      throw new Error("File System Access API not supported");
    }

    try {
      return await window.showDirectoryPicker();
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return null;
      }
      throw error;
    }
  }

  async *listFiles(handle: FileSystemDirectoryHandle): AsyncIterable<File> {
    for await (const [, entry] of handle.entries()) {
      if (entry.kind === "file") {
        const fileHandle = entry as FileSystemFileHandle;
        const file = await fileHandle.getFile();
        yield file;
      } else if (entry.kind === "directory") {
        const dirHandle = entry as FileSystemDirectoryHandle;
        yield* this.listFiles(dirHandle);
      }
    }
  }

  async readFile(file: File): Promise<ArrayBuffer> {
    return await file.arrayBuffer();
  }
}
