import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FileMetadata } from '../../../src/core/types';
import { FileType } from '../../../src/core/types';

// Mock Papa Parse
const mockPapaResult = {
  data: [
    ['Name', 'Age', 'City'],
    ['John', '25', 'New York'],
    ['Jane', '30', 'London'],
    ['Bob', '35', 'Paris'],
  ],
  errors: [],
  meta: {
    delimiter: ',',
    linebreak: '\n',
    aborted: false,
    truncated: false,
    cursor: 100,
  },
};

vi.mock('papaparse', () => ({
  default: {
    parse: vi.fn().mockReturnValue(mockPapaResult),
  },
}));

// Mock crypto
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: vi.fn().mockReturnValue('csv-uuid-123'),
  },
  configurable: true,
});

describe('CSVExtractor', () => {
  let CSVExtractor: any;
  let extractor: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Dynamic import to ensure mocks are applied
    const module = await import('../../../src/extractors/csv');
    CSVExtractor = module.CSVExtractor;
    extractor = new CSVExtractor();
  });

  const sampleMetadata: FileMetadata = {
    id: 'csv-file-1',
    path: 'data.csv',
    name: 'data.csv',
    extension: 'csv',
    size: 512,
    lastModified: Date.now(),
    type: FileType.CSV,
    hash: 'csv-hash',
  };

  describe('supports', () => {
    it('should support CSV files', () => {
      expect(extractor.supports('csv')).toBe(true);
    });

    it('should not support non-CSV files', () => {
      expect(extractor.supports('pdf')).toBe(false);
      expect(extractor.supports('txt')).toBe(false);
      expect(extractor.supports('docx')).toBe(false);
    });
  });

  describe('extractText', () => {
    it('should extract text from CSV buffer', async () => {
      const csvBuffer = new ArrayBuffer(512);
      
      const text = await extractor.extractText(csvBuffer, sampleMetadata);
      
      expect(text).toContain('Name Age City');
      expect(text).toContain('John 25 New York');
      expect(text).toContain('Jane 30 London');
      expect(text).toContain('Bob 35 Paris');
    });

    it('should handle empty CSV files', async () => {
      const csvBuffer = new ArrayBuffer(10);
      
      const Papa = await import('papaparse');
      vi.mocked(Papa.default.parse).mockReturnValueOnce({
        data: [],
        errors: [],
        meta: mockPapaResult.meta,
      });

      const text = await extractor.extractText(csvBuffer, sampleMetadata);
      
      expect(text).toBe('');
    });

    it('should handle CSV parsing errors gracefully', async () => {
      const csvBuffer = new ArrayBuffer(512);
      
      const Papa = await import('papaparse');
      vi.mocked(Papa.default.parse).mockReturnValueOnce({
        data: [],
        errors: [{ message: 'Parse error', row: 1 }],
        meta: mockPapaResult.meta,
      });

      await expect(extractor.extractText(csvBuffer, sampleMetadata))
        .rejects.toThrow('CSV extraction failed');
    });

    it('should handle different CSV formats', async () => {
      const csvBuffer = new ArrayBuffer(256);
      
      const Papa = await import('papaparse');
      vi.mocked(Papa.default.parse).mockReturnValueOnce({
        data: [
          ['Product', 'Price', 'Stock'],
          ['Laptop', '999.99', '10'],
          ['Mouse', '29.99', '50'],
        ],
        errors: [],
        meta: { ...mockPapaResult.meta, delimiter: ';' },
      });

      const text = await extractor.extractText(csvBuffer, sampleMetadata);
      
      expect(text).toContain('Product Price Stock');
      expect(text).toContain('Laptop 999.99 10');
      expect(text).toContain('Mouse 29.99 50');
    });

    it('should handle CSV with headers only', async () => {
      const csvBuffer = new ArrayBuffer(100);
      
      const Papa = await import('papaparse');
      vi.mocked(Papa.default.parse).mockReturnValueOnce({
        data: [['ID', 'Name', 'Email']],
        errors: [],
        meta: mockPapaResult.meta,
      });

      const text = await extractor.extractText(csvBuffer, sampleMetadata);
      
      expect(text).toBe('ID Name Email');
    });

    it('should handle large CSV files efficiently', async () => {
      const csvBuffer = new ArrayBuffer(10240);
      
      // Generate large dataset
      const largeData = [['ID', 'Name', 'Value']];
      for (let i = 1; i <= 100; i++) {
        largeData.push([i.toString(), `Item${i}`, (Math.random() * 1000).toFixed(2)]);
      }
      
      const Papa = await import('papaparse');
      vi.mocked(Papa.default.parse).mockReturnValueOnce({
        data: largeData,
        errors: [],
        meta: mockPapaResult.meta,
      });

      const text = await extractor.extractText(csvBuffer, sampleMetadata);
      
      expect(text).toContain('ID Name Value');
      expect(text).toContain('Item1');
      expect(text).toContain('Item100');
    });
  });

  describe('extract', () => {
    it('should return DocumentContent with extracted text', async () => {
      const csvContent = 'Name,Age,City\nJohn,25,New York\nJane,30,London';
      const file = new File([csvContent], 'test.csv', { type: 'text/csv' });

      const result = await extractor.extract(file, sampleMetadata);

      expect(result.id).toBe('csv-uuid-123');
      expect(result.fileId).toBe('csv-file-1');
      expect(result.text).toContain('Name Age City');
      expect(result.metadata).toEqual({});
    });
  });

  describe('encoding detection', () => {
    it('should handle different text encodings', () => {
      const utf8Buffer = new TextEncoder().encode('Name,Price\nTest,€100');
      const arrayBuffer = utf8Buffer.buffer;

      const encoding = extractor.detectEncoding(arrayBuffer);
      expect(encoding).toBe('utf-8');
    });

    it('should fall back to latin1 for non-UTF8 content', () => {
      // Create a buffer with invalid UTF-8 sequences
      const invalidUtf8 = new ArrayBuffer(10);
      const view = new Uint8Array(invalidUtf8);
      view[0] = 0xFF; // Invalid UTF-8 start byte
      view[1] = 0xFE;

      const encoding = extractor.detectEncoding(invalidUtf8);
      expect(encoding).toBe('latin1');
    });
  });

  describe('text formatting', () => {
    it('should properly format CSV data as searchable text', async () => {
      const csvBuffer = new ArrayBuffer(200);
      
      const Papa = await import('papaparse');
      vi.mocked(Papa.default.parse).mockReturnValueOnce({
        data: [
          ['Product', 'Description', 'Category'],
          ['iPhone', 'Smartphone with advanced features', 'Electronics'],
          ['Book', 'Programming guide for beginners', 'Education'],
        ],
        errors: [],
        meta: mockPapaResult.meta,
      });

      const text = await extractor.extractText(csvBuffer, sampleMetadata);
      
      // Check that both headers and data are searchable
      expect(text).toContain('Product Description Category');
      expect(text).toContain('iPhone Smartphone with advanced features Electronics');
      expect(text).toContain('Book Programming guide for beginners Education');
    });
  });
});