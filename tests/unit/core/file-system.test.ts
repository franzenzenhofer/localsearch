import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  BrowserFileSystemProvider, 
  generateFileHash, 
  createFileMetadata 
} from '../../../src/core/file-system';

// Setup global mocks
Object.defineProperty(globalThis, 'crypto', {
  value: {
    subtle: {
      digest: vi.fn().mockImplementation((algorithm: string, data: ArrayBuffer) => {
        // Return a mock ArrayBuffer for SHA-256
        const buffer = new ArrayBuffer(32);
        new Uint8Array(buffer).fill(1); // Fill with 1s for consistent hash
        return Promise.resolve(buffer);
      }),
    },
    randomUUID: vi.fn().mockReturnValue('test-uuid-12345'),
  },
  configurable: true,
});

Object.defineProperty(globalThis, 'window', {
  value: {
    showDirectoryPicker: vi.fn(),
  },
  configurable: true,
});

describe('BrowserFileSystemProvider', () => {
  let provider: BrowserFileSystemProvider;

  beforeEach(() => {
    provider = new BrowserFileSystemProvider();
    vi.clearAllMocks();
  });

  describe('isSupported', () => {
    it('should return true when File System Access API is available', () => {
      expect(provider.isSupported()).toBe(true);
    });

    it('should return false when File System Access API is not available', () => {
      const originalPicker = globalThis.window.showDirectoryPicker;
      delete (globalThis.window as any).showDirectoryPicker;
      
      expect(provider.isSupported()).toBe(false);
      
      // Restore for other tests
      globalThis.window.showDirectoryPicker = originalPicker;
    });
  });

  describe('selectFolder', () => {
    it('should call showDirectoryPicker when supported', async () => {
      const mockHandle = { kind: 'directory', name: 'test' };
      vi.mocked(globalThis.window.showDirectoryPicker).mockResolvedValue(mockHandle);

      const result = await provider.selectFolder();

      expect(globalThis.window.showDirectoryPicker).toHaveBeenCalled();
      expect(result).toBe(mockHandle);
    });

    it('should return null when user cancels selection', async () => {
      const abortError = new Error('User cancelled');
      abortError.name = 'AbortError';
      vi.mocked(globalThis.window.showDirectoryPicker).mockRejectedValue(abortError);

      const result = await provider.selectFolder();

      expect(result).toBeNull();
    });

    it('should throw error when API is not supported', async () => {
      const originalPicker = globalThis.window.showDirectoryPicker;
      delete (globalThis.window as any).showDirectoryPicker;

      await expect(provider.selectFolder()).rejects.toThrow(
        'File System Access API not supported'
      );

      // Restore
      globalThis.window.showDirectoryPicker = originalPicker;
    });
  });

  describe('readFile', () => {
    it('should read file as ArrayBuffer', async () => {
      const content = 'test file content';
      const file = new File([content], 'test.txt');

      const buffer = await provider.readFile(file);

      expect(buffer).toBeInstanceOf(ArrayBuffer);
      expect(new TextDecoder().decode(buffer)).toBe(content);
    });
  });
});

describe('File utilities', () => {
  describe('generateFileHash', () => {
    it('should generate consistent hash for same file content', async () => {
      const content = 'test content for hashing';
      const file = new File([content], 'test.txt');

      const hash = await generateFileHash(file);

      expect(typeof hash).toBe('string');
      expect(hash).toHaveLength(64); // SHA-256 produces 64 character hex string
      expect(hash).toBe('0101010101010101010101010101010101010101010101010101010101010101'); // Based on our mock
    });
  });

  describe('createFileMetadata', () => {
    it('should create metadata for text file', () => {
      const file = new File(['content'], 'document.txt', {
        lastModified: 1234567890,
      });
      const hash = 'test-hash-value';

      const metadata = createFileMetadata(file, hash);

      expect(metadata.id).toBe('test-uuid-12345');
      expect(metadata.name).toBe('document.txt');
      expect(metadata.extension).toBe('txt');
      expect(metadata.type).toBe('txt');
      expect(metadata.size).toBe(7); // 'content' length
      expect(metadata.lastModified).toBe(1234567890);
      expect(metadata.hash).toBe(hash);
    });

    it('should handle files without extension', () => {
      const file = new File(['content'], 'README');
      const metadata = createFileMetadata(file, 'hash');

      expect(metadata.extension).toBe('');
      expect(metadata.type).toBe('unknown');
    });

    it('should use webkitRelativePath when available', () => {
      const file = new File(['content'], 'test.txt');
      Object.defineProperty(file, 'webkitRelativePath', {
        value: 'folder/test.txt',
        configurable: true,
      });

      const metadata = createFileMetadata(file, 'hash');

      expect(metadata.path).toBe('folder/test.txt');
    });

    it('should map known file extensions to types', () => {
      const extensions = ['pdf', 'docx', 'txt', 'md', 'csv', 'html'];
      
      extensions.forEach(ext => {
        const file = new File(['content'], `test.${ext}`);
        const metadata = createFileMetadata(file, 'hash');
        
        expect(metadata.extension).toBe(ext);
        expect(metadata.type).toBe(ext);
      });
    });

    it('should handle unknown file extensions', () => {
      const file = new File(['content'], 'test.xyz');
      const metadata = createFileMetadata(file, 'hash');

      expect(metadata.extension).toBe('xyz');
      expect(metadata.type).toBe('unknown');
    });
  });
});