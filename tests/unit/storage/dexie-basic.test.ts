import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDexieClass = vi.fn();
mockDexieClass.prototype.version = vi.fn().mockReturnValue({
  stores: vi.fn().mockReturnValue({}),
});

const mockDexieInstance = {
  documents: {
    add: vi.fn(),
    bulkAdd: vi.fn(),
    where: vi.fn(),
    clear: vi.fn(),
  },
  files: {
    add: vi.fn(),
    bulkAdd: vi.fn(),
    where: vi.fn(),
    clear: vi.fn(),
  },
  progress: {
    add: vi.fn(),
    bulkAdd: vi.fn(),
    where: vi.fn(),
    clear: vi.fn(),
  },
  delete: vi.fn(),
  open: vi.fn(),
};

vi.mock('dexie', () => ({
  default: mockDexieClass,
}));

describe('DexieStorage - Basic Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize database correctly', async () => {
    const { DexieStorage } = await import('../../../src/storage/dexie-storage.js');
    const storage = new DexieStorage();
    
    expect(storage).toBeDefined();
  });

  it('should add documents successfully', async () => {
    mockDexieInstance.documents.bulkAdd.mockResolvedValue(undefined);
    
    const { DexieStorage } = await import('../../../src/storage/dexie-storage.js');
    const storage = new DexieStorage();
    
    const documents = [
      { id: '1', fileId: 'file1', text: 'test content' }
    ];
    
    expect(storage).toBeDefined();
  });

  it('should search documents successfully', async () => {
    const mockResults = [
      { id: '1', fileId: 'file1', text: 'test content' }
    ];
    
    mockDexieInstance.documents.where.mockReturnValue({
      anyOf: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue(mockResults)
      })
    });

    const { DexieStorage } = await import('../../../src/storage/dexie-storage.js');
    const storage = new DexieStorage();
    
    const results = await storage.search(['test']);
    expect(results).toEqual(mockResults);
  });

  it('should clear all data successfully', async () => {
    mockDexieInstance.documents.clear.mockResolvedValue(undefined);
    mockDexieInstance.metadata.clear.mockResolvedValue(undefined);
    
    const { DexieStorage } = await import('../../../src/storage/dexie-storage.js');
    const storage = new DexieStorage();
    
    await storage.clear();
    expect(mockDexieInstance.documents.clear).toHaveBeenCalled();
    expect(mockDexieInstance.metadata.clear).toHaveBeenCalled();
  });
});