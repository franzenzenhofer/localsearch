import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FileMetadata } from '../../../src/core/types';
import { FileType } from '../../../src/core/types';

// Mock Mammoth.js
const mockMammothResult = {
  value: '<p>Hello from DOCX!</p><p>This is paragraph 2.</p>',
  messages: [],
};

vi.mock('mammoth', () => ({
  extractRawText: vi.fn().mockResolvedValue({
    value: 'Hello from DOCX!\n\nThis is paragraph 2.',
    messages: [],
  }),
  convertToHtml: vi.fn().mockResolvedValue(mockMammothResult),
}));

// Mock crypto
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: vi.fn().mockReturnValue('docx-uuid-123'),
  },
  configurable: true,
});

describe('DOCXExtractor', () => {
  let DOCXExtractor: any;
  let extractor: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Dynamic import to ensure mocks are applied
    const module = await import('../../../src/extractors/docx');
    DOCXExtractor = module.DOCXExtractor;
    extractor = new DOCXExtractor();
  });

  const sampleMetadata: FileMetadata = {
    id: 'docx-file-1',
    path: 'document.docx',
    name: 'document.docx',
    extension: 'docx',
    size: 2048,
    lastModified: Date.now(),
    type: FileType.DOCX,
    hash: 'docx-hash',
  };

  describe('supports', () => {
    it('should support DOCX files', () => {
      expect(extractor.supports('docx')).toBe(true);
    });

    it('should not support non-DOCX files', () => {
      expect(extractor.supports('pdf')).toBe(false);
      expect(extractor.supports('txt')).toBe(false);
      expect(extractor.supports('html')).toBe(false);
    });
  });

  describe('extractText', () => {
    it('should extract text from DOCX buffer', async () => {
      const docxBuffer = new ArrayBuffer(2048);
      
      const text = await extractor.extractText(docxBuffer, sampleMetadata);
      
      expect(text).toContain('Hello from DOCX!');
      expect(text).toContain('This is paragraph 2.');
    });

    it('should handle empty DOCX files', async () => {
      const docxBuffer = new ArrayBuffer(1024);
      
      // Mock empty result
      const mammoth = await import('mammoth');
      vi.mocked(mammoth.extractRawText).mockResolvedValueOnce({
        value: '',
        messages: [],
      });

      const text = await extractor.extractText(docxBuffer, sampleMetadata);
      
      expect(text).toBe('');
    });

    it('should handle DOCX parsing errors gracefully', async () => {
      const docxBuffer = new ArrayBuffer(1024);
      
      const mammoth = await import('mammoth');
      vi.mocked(mammoth.extractRawText).mockRejectedValueOnce(
        new Error('DOCX parsing failed')
      );

      await expect(extractor.extractText(docxBuffer, sampleMetadata))
        .rejects.toThrow('DOCX extraction failed');
    });

    it('should extract structured content from complex DOCX', async () => {
      const docxBuffer = new ArrayBuffer(4096);
      
      const mammoth = await import('mammoth');
      vi.mocked(mammoth.extractRawText).mockResolvedValueOnce({
        value: 'Title\n\nIntroduction paragraph.\n\nMain content with formatting.\n\nConclusion.',
        messages: [],
      });

      const text = await extractor.extractText(docxBuffer, sampleMetadata);
      
      expect(text).toContain('Title');
      expect(text).toContain('Introduction paragraph.');
      expect(text).toContain('Main content with formatting.');
      expect(text).toContain('Conclusion.');
    });
  });

  describe('extract', () => {
    it('should return DocumentContent with extracted text', async () => {
      const docxContent = new Uint8Array([0x50, 0x4B]); // ZIP header
      const file = new File([docxContent], 'test.docx', { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });

      const result = await extractor.extract(file, sampleMetadata);

      expect(result.id).toBe('docx-uuid-123');
      expect(result.fileId).toBe('docx-file-1');
      expect(result.text).toContain('Hello from DOCX!');
      expect(result.metadata).toEqual({});
    });
  });

  describe('error handling', () => {
    it('should handle corrupted DOCX files', async () => {
      const corruptedBuffer = new ArrayBuffer(100);
      
      const mammoth = await import('mammoth');
      vi.mocked(mammoth.extractRawText).mockRejectedValueOnce(
        new Error('Not a valid ZIP file')
      );

      await expect(extractor.extractText(corruptedBuffer, sampleMetadata))
        .rejects.toThrow('DOCX extraction failed');
    });

    it('should handle DOCX files with warnings', async () => {
      const docxBuffer = new ArrayBuffer(2048);
      
      const mammoth = await import('mammoth');
      vi.mocked(mammoth.extractRawText).mockResolvedValueOnce({
        value: 'Document content with warnings',
        messages: [
          { type: 'warning', message: 'Unsupported style' },
        ],
      });

      const text = await extractor.extractText(docxBuffer, sampleMetadata);
      
      expect(text).toBe('Document content with warnings');
    });
  });

  describe('text cleaning', () => {
    it('should clean DOCX extracted text', () => {
      const mammothText = 'Title\n\n\nParagraph 1\n\n\n\nParagraph 2\n\n  ';
      const cleanText = extractor.cleanText(mammothText);

      expect(cleanText).toContain('Title');
      expect(cleanText).toContain('Paragraph 1');
      expect(cleanText).toContain('Paragraph 2');
      expect(cleanText.startsWith('Title')).toBe(true);
      expect(cleanText.endsWith('Paragraph 2')).toBe(true);
    });
  });
});