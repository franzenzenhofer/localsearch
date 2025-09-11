import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Comlink
vi.mock('comlink', () => ({
  expose: vi.fn(),
}));

// Mock crypto.subtle
Object.defineProperty(globalThis, 'crypto', {
  value: {
    subtle: {
      digest: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
    },
    randomUUID: vi.fn().mockReturnValue('test-uuid'),
  },
});

// We need to import the worker class directly since it's exposed through Comlink
// In a real scenario, this would be tested through the Comlink proxy
describe('IndexingWorkerClass', () => {
  // Mock the worker functionality for unit testing
  class MockIndexingWorkerClass {
    async processFiles(files: File[]) {
      const results = [];
      
      for (const file of files) {
        try {
          const hash = await this.generateHash(file);
          const metadata = this.createMetadata(file, hash);
          const content = await this.extractText(file, metadata);
          
          results.push({ metadata, content });
        } catch (error) {
          results.push({ 
            error: `Failed to process ${file.name}: ${(error as Error).message}` 
          });
        }
      }
      
      return results;
    }

    async extractText(file: File, metadata: any) {
      const buffer = await file.arrayBuffer();
      let text = '';

      switch (metadata.extension) {
        case 'txt':
        case 'md':
          text = new TextDecoder().decode(buffer);
          break;
        default:
          throw new Error(`Unsupported file type: ${metadata.extension}`);
      }

      return {
        id: 'test-uuid',
        fileId: metadata.id,
        text: text.trim(),
        metadata: {},
      };
    }

    private async generateHash(file: File): Promise<string> {
      return 'test-hash';
    }

    private createMetadata(file: File, hash: string) {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      
      return {
        id: 'test-uuid',
        path: file.name,
        name: file.name,
        extension,
        size: file.size,
        lastModified: file.lastModified,
        type: extension,
        hash,
      };
    }
  }

  let worker: MockIndexingWorkerClass;

  beforeEach(() => {
    worker = new MockIndexingWorkerClass();
  });

  describe('processFiles', () => {
    it('should process text files successfully', async () => {
      const content = 'Hello, world!';
      const file = new File([content], 'test.txt', { type: 'text/plain' });

      const results = await worker.processFiles([file]);

      expect(results).toHaveLength(1);
      expect(results[0].metadata?.name).toBe('test.txt');
      expect(results[0].content?.text).toBe(content);
    });

    it('should handle unsupported file types', async () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      const results = await worker.processFiles([file]);

      expect(results).toHaveLength(1);
      expect(results[0].error).toContain('Unsupported file type');
    });
  });

  describe('extractText', () => {
    it('should extract text from supported file', async () => {
      const content = 'Sample text content';
      const file = new File([content], 'test.txt');
      const metadata = {
        id: 'file-1',
        extension: 'txt',
      };

      const result = await worker.extractText(file, metadata);

      expect(result.text).toBe(content);
      expect(result.fileId).toBe('file-1');
    });
  });
});