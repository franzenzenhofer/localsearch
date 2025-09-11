import { describe, it, expect, beforeEach } from 'vitest';
import { MiniSearchEngine } from '../../../src/search/mini-search-engine';
import type { DocumentContent, FileMetadata } from '../../../src/core/types';
import { FileType } from '../../../src/core/types';

describe('MiniSearchEngine', () => {
  let engine: MiniSearchEngine;
  let sampleDocs: DocumentContent[];
  let sampleMetadata: FileMetadata;

  beforeEach(() => {
    engine = new MiniSearchEngine();
    
    sampleMetadata = {
      id: 'file-1',
      path: 'test.txt',
      name: 'test.txt',
      extension: 'txt',
      size: 100,
      lastModified: Date.now(),
      type: FileType.TXT,
      hash: 'hash123',
    };

    sampleDocs = [
      {
        id: 'doc-1',
        fileId: 'file-1',
        text: 'The quick brown fox jumps over the lazy dog',
        metadata: {},
      },
      {
        id: 'doc-2', 
        fileId: 'file-2',
        text: 'JavaScript is a programming language',
        metadata: {},
      },
    ];
  });

  describe('addDocuments', () => {
    it('should add documents to index', async () => {
      await engine.addDocuments(sampleDocs);
      
      const results = await engine.search({ text: 'fox' });
      expect(results).toHaveLength(1);
      expect(results[0].fileId).toBe('file-1');
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      engine.setMetadata('file-1', sampleMetadata);
      await engine.addDocuments(sampleDocs);
    });

    it('should find exact matches', async () => {
      const results = await engine.search({ text: 'fox' });
      
      expect(results).toHaveLength(1);
      expect(results[0].fileId).toBe('file-1');
      expect(results[0].score).toBeGreaterThan(0);
    });

    it('should support fuzzy search', async () => {
      const results = await engine.search({ text: 'programing' });
      
      expect(results).toHaveLength(1);
      expect(results[0].fileId).toBe('file-2');
    });

    it('should limit results', async () => {
      const results = await engine.search({ text: 'the', limit: 1 });
      
      expect(results).toHaveLength(1);
    });

    it('should generate snippets', async () => {
      const results = await engine.search({ text: 'fox' });
      
      expect(results[0].snippets).toHaveLength(1);
      expect(results[0].snippets[0].text).toContain('fox');
    });
  });

  describe('removeDocument', () => {
    it('should remove document from index', async () => {
      await engine.addDocuments(sampleDocs);
      await engine.removeDocument('doc-1');
      
      const results = await engine.search({ text: 'fox' });
      expect(results).toHaveLength(0);
    });
  });

  describe('clear', () => {
    it('should clear all documents', async () => {
      await engine.addDocuments(sampleDocs);
      await engine.clear();
      
      const results = await engine.search({ text: 'fox' });
      expect(results).toHaveLength(0);
    });
  });
});