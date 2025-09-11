import { describe, it, expect } from 'vitest';

describe('IndexingWorkerClass - Basic Operations', () => {
  it('should extract text from TXT files', async () => {
    const { IndexingWorkerClass } = await import('../../../src/workers/indexing-worker.js');
    const worker = new IndexingWorkerClass();
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const metadata = { 
      id: '1', extension: 'txt', path: 'test.txt', name: 'test.txt', 
      size: 12, lastModified: Date.now(), type: 'txt' as any, hash: 'hash' 
    };
    const result = await worker.extractText(file, metadata);
    
    expect(result.text).toBe('test content');
    expect(result.fileId).toBe('1');
  });

  it('should extract text from HTML files', async () => {
    const { IndexingWorkerClass } = await import('../../../src/workers/indexing-worker.js');
    const worker = new IndexingWorkerClass();
    
    const file = new File(['<html><body>HTML content</body></html>'], 'test.html', { type: 'text/html' });
    const metadata = { 
      id: '2', extension: 'html', path: 'test.html', name: 'test.html', 
      size: 35, lastModified: Date.now(), type: 'html' as any, hash: 'hash2' 
    };
    const result = await worker.extractText(file, metadata);
    
    expect(result.text).toBe('HTML content');
    expect(result.fileId).toBe('2');
  });

  it('should handle unsupported file types', async () => {
    const { IndexingWorkerClass } = await import('../../../src/workers/indexing-worker.js');
    const worker = new IndexingWorkerClass();
    
    const file = new File(['unknown content'], 'test.unknown', { type: 'application/unknown' });
    const metadata = { 
      id: '3', extension: 'unknown', path: 'test.unknown', name: 'test.unknown', 
      size: 15, lastModified: Date.now(), type: 'unknown' as any, hash: 'hash3' 
    };
    
    await expect(worker.extractText(file, metadata)).rejects.toThrow('Unsupported file type');
  });
});