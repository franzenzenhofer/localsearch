import { createFileMetadata, generateFileHash } from '../utils/file-utils.js';

export class MetadataGenerator {
  async generateHash(file: File): Promise<string> {
    return await generateFileHash(file);
  }

  createMetadata(file: File, hash: string) {
    return createFileMetadata(file, hash);
  }
}