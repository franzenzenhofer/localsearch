import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FileMetadata } from '../../../src/core/types';
import { FileType } from '../../../src/core/types';

// Mock PDF.js
const mockPdfDocument = {
  numPages: 2,
  getPage: vi.fn(),
};

const mockPage = {
  getTextContent: vi.fn().mockResolvedValue({
    items: [
      { str: 'Hello ', transform: [1, 0, 0, 1, 0, 0] },
      { str: 'world!', transform: [1, 0, 0, 1, 0, 0] },
      { str: ' This is page 1.', transform: [1, 0, 0, 1, 0, 0] },
    ],
  }),
};

vi.mock('pdfjs-dist', () => ({
  getDocument: vi.fn().mockReturnValue({
    promise: Promise.resolve(mockPdfDocument),
  }),
  GlobalWorkerOptions: {
    workerSrc: '',
  },
}));

// Mock crypto
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: vi.fn().mockReturnValue('pdf-uuid-123'),
  },
  configurable: true,
});

describe('PDFExtractor', () => {
  let PDFExtractor: any;
  let extractor: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockPdfDocument.getPage.mockResolvedValue(mockPage);
    mockPdfDocument.numPages = 1;
    
    // Dynamic import to ensure mocks are applied
    const module = await import('../../../src/extractors/pdf');
    PDFExtractor = module.PDFExtractor;
    extractor = new PDFExtractor();
  });

  const sampleMetadata: FileMetadata = {
    id: 'pdf-file-1',
    path: 'document.pdf',
    name: 'document.pdf',
    extension: 'pdf',
    size: 1024,
    lastModified: Date.now(),
    type: FileType.PDF,
    hash: 'pdf-hash',
  };

  describe('supports', () => {
    it('should support PDF files', () => {
      expect(extractor.supports('pdf')).toBe(true);
    });

    it('should not support non-PDF files', () => {
      expect(extractor.supports('txt')).toBe(false);
      expect(extractor.supports('docx')).toBe(false);
      expect(extractor.supports('html')).toBe(false);
    });
  });

  describe('extractText', () => {
    it('should extract text from PDF buffer', async () => {
      const pdfBuffer = new ArrayBuffer(1024);
      
      const text = await extractor.extractText(pdfBuffer, sampleMetadata);
      
      expect(text).toContain('Hello world!');
      expect(text).toContain('This is page 1.');
    });

    it('should handle multi-page PDFs', async () => {
      const pdfBuffer = new ArrayBuffer(1024);
      mockPdfDocument.numPages = 2;
      
      // Mock second page
      const mockPage2 = {
        getTextContent: vi.fn().mockResolvedValue({
          items: [
            { str: 'Page 2 content', transform: [1, 0, 0, 1, 0, 0] },
          ],
        }),
      };
      
      mockPdfDocument.getPage.mockImplementation((pageNum: number) => {
        if (pageNum === 1) return Promise.resolve(mockPage);
        if (pageNum === 2) return Promise.resolve(mockPage2);
        throw new Error('Invalid page number');
      });

      const text = await extractor.extractText(pdfBuffer, sampleMetadata);
      
      expect(text).toContain('Hello world!');
      expect(text).toContain('Page 2 content');
    });

    it('should handle empty PDFs', async () => {
      const pdfBuffer = new ArrayBuffer(1024);
      mockPdfDocument.numPages = 1;
      mockPage.getTextContent.mockResolvedValue({ items: [] });

      const text = await extractor.extractText(pdfBuffer, sampleMetadata);
      
      expect(text).toBe('');
    });

    it('should handle PDF parsing errors gracefully', async () => {
      const pdfBuffer = new ArrayBuffer(1024);
      mockPdfDocument.getPage.mockRejectedValue(new Error('PDF parsing failed'));

      await expect(extractor.extractText(pdfBuffer, sampleMetadata))
        .rejects.toThrow('PDF extraction failed');
    });
  });

  describe('extract', () => {
    it('should return DocumentContent with extracted text', async () => {
      const pdfContent = 'PDF file content';
      const file = new File([pdfContent], 'test.pdf', { type: 'application/pdf' });

      // Ensure the extractText method will be called correctly
      const extractTextSpy = vi.spyOn(extractor, 'extractText').mockResolvedValue('Hello world! This is test content.');

      const result = await extractor.extract(file, sampleMetadata);

      expect(result.id).toBe('pdf-uuid-123');
      expect(result.fileId).toBe('pdf-file-1');
      expect(result.text).toBe('Hello world! This is test content.');
      expect(result.metadata).toEqual({});
      expect(extractTextSpy).toHaveBeenCalled();
    });
  });

  describe('text cleaning', () => {
    it('should clean extracted text properly', () => {
      const dirtyText = '  Hello\r\nworld!\r\n\n\n  Test  \n\n  ';
      const cleanText = extractor.cleanText(dirtyText);

      expect(cleanText).toContain('Hello');
      expect(cleanText).toContain('world!');
      expect(cleanText).toContain('Test');
      expect(cleanText.startsWith('Hello')).toBe(true);
      expect(cleanText.endsWith('Test')).toBe(true);
    });

    it('should handle various whitespace characters', () => {
      const text = 'Text\twith\ttabs\r\nand\r\nreturns';
      const cleanText = extractor.cleanText(text);

      expect(cleanText).toBe('Text\twith\ttabs\nand\nreturns');
    });
  });
});