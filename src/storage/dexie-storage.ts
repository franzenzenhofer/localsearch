import Dexie, { Table } from "dexie";

export interface StoredFile {
  id: string;
  name: string;
  content: string;
  metadata: Record<string, unknown>;
}

export class DexieStorage extends Dexie {
  files!: Table<StoredFile>;

  constructor() {
    super("LocalSearchDB");
    this.version(1).stores({
      files: "id, name, content",
    });
  }

  async storeFile(file: StoredFile): Promise<void> {
    await this.files.put(file);
  }

  async getFile(id: string): Promise<StoredFile | undefined> {
    return this.files.get(id);
  }

  async getAllFiles(): Promise<StoredFile[]> {
    return this.files.toArray();
  }

  async deleteFile(id: string): Promise<void> {
    await this.files.delete(id);
  }

  async clearAll(): Promise<void> {
    await this.files.clear();
  }

  async searchFiles(query: string): Promise<StoredFile[]> {
    return this.files
      .filter((file) =>
        file.content.toLowerCase().includes(query.toLowerCase()),
      )
      .toArray();
  }

  async search(queries: string[]): Promise<StoredFile[]> {
    const queryStr = queries.join(" ").toLowerCase();
    return this.files
      .filter((file) => file.content.toLowerCase().includes(queryStr))
      .toArray();
  }

  get database() {
    return this;
  }
}
