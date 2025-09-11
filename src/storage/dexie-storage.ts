// Re-export all the modular components
export type { StorageProvider } from './storage-interface';
export { LocalSearchDB } from './dexie-db';
export { DexieStorageProvider } from './dexie-provider';

// Legacy compatibility export
import { LocalSearchDB } from './dexie-db';
export class DexieStorage extends LocalSearchDB {}