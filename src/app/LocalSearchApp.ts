import { AppCore } from './app-core.js';
import { setupUI, updateProgress, updateStats } from './ui-setup.js';
import { setupEventListeners } from './event-handlers.js';
import { displayResults, clearResults } from './search-display.js';
import { processFiles, filterValidFiles } from './file-processing.js';

export class LocalSearchApp {
  private core: AppCore;

  constructor() {
    this.core = new AppCore();
  }

  async initialize(): Promise<void> {
    setupUI();
    setupEventListeners(this);
    updateStats(this.core.getIndexedCount());
  }

  async handleFolderSelection(): Promise<void> {
    try {
      const directoryHandle = await this.core.fileSystemProvider.selectFolder();
      if (!directoryHandle) return;
      
      const files: File[] = [];
      for await (const file of this.core.fileSystemProvider.listFiles(directoryHandle)) {
        files.push(file);
      }
      
      await this.indexFiles(files);
    } catch (error) {
      console.error('Folder selection failed:', error);
      alert('Folder selection not supported. Use file selection instead.');
    }
  }

  async handleFileSelection(files: File[]): Promise<void> {
    const validFiles = filterValidFiles(files);
    if (validFiles.length === 0) {
      alert('No supported files. Select PDF, DOCX, TXT, MD, CSV, or HTML files.');
      return;
    }
    
    await this.indexFiles(validFiles);
  }

  async indexFiles(files: File[]): Promise<void> {
    if (files.length === 0) return;

    const results = await processFiles(files, this.core.extractors, updateProgress);
    
    for (const { content, metadata } of results) {
      await this.core.addDocument({
        id: `${metadata.name}_${Date.now()}`,
        title: metadata.name,
        content,
        path: metadata.path,
        lastModified: new Date(metadata.lastModified),
        size: metadata.size
      });
    }

    updateStats(this.core.getIndexedCount());
    updateProgress(0, 0);
  }

  async performSearch(query: string): Promise<void> {
    const results = await this.core.search(query);
    displayResults(results);
  }

  clearResults(): void {
    clearResults();
  }
}