import { BrowserFileSystemProvider } from '../core/file-system';
import { DexieStorageProvider } from '../storage/dexie-storage';
import { MiniSearchEngine } from '../search/mini-search-engine';
import { TextExtractor } from '../extractors/text';
import { PDFExtractor } from '../extractors/pdf';
import { DOCXExtractor } from '../extractors/docx';
import { CSVExtractor } from '../extractors/csv';
import type { TextExtractor as ITextExtractor } from '../extractors/base';
import type { SearchResult, FileType } from '../core/types';

export class LocalSearchApp {
  private fileSystemProvider: BrowserFileSystemProvider;
  private storageProvider: DexieStorageProvider;
  private searchEngine: MiniSearchEngine;
  private extractors: Map<string, ITextExtractor>;

  constructor() {
    this.fileSystemProvider = new BrowserFileSystemProvider();
    this.storageProvider = new DexieStorageProvider();
    this.searchEngine = new MiniSearchEngine();
    
    this.extractors = new Map([
      ['txt', new TextExtractor()],
      ['md', new TextExtractor()],
      ['html', new TextExtractor()],
      ['pdf', new PDFExtractor()],
      ['docx', new DOCXExtractor()],
      ['csv', new CSVExtractor()],
    ]);
  }

  async initialize(): Promise<void> {
    this.setupUI();
    this.setupEventListeners();
  }

  private setupUI(): void {
    const app = document.querySelector('#app');
    if (!app) return;

    app.innerHTML = `
      <div class="container">
        <header class="header">
          <h1>LocalSearch</h1>
          <p>Private, offline folder search</p>
        </header>
        
        <main class="main">
          <div class="search-section">
            <div class="search-bar">
              <input type="text" id="search-input" placeholder="Search your files..." />
              <button id="search-btn" type="button">Search</button>
            </div>
          </div>
          
          <div class="folder-section">
            <button id="select-folder-btn" type="button">
              Select Folder to Index
            </button>
            <div id="indexing-progress" class="progress-hidden">
              <div class="progress-bar">
                <div id="progress-fill" class="progress-fill"></div>
              </div>
              <div id="progress-text">Indexing files...</div>
            </div>
          </div>
          
          <div class="results-section">
            <div id="results-container"></div>
          </div>
        </main>
      </div>
    `;
  }

  private setupEventListeners(): void {
    const selectFolderBtn = document.getElementById('select-folder-btn');
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const searchBtn = document.getElementById('search-btn');

    selectFolderBtn?.addEventListener('click', () => this.handleFolderSelection());
    searchInput?.addEventListener('input', (e) => this.handleSearch((e.target as HTMLInputElement).value));
    searchBtn?.addEventListener('click', () => this.handleSearch(searchInput?.value || ''));
  }

  private async handleFolderSelection(): Promise<void> {
    if (!this.fileSystemProvider.isSupported()) {
      alert('File System Access API is not supported in this browser.');
      return;
    }

    try {
      const folderHandle = await this.fileSystemProvider.selectFolder();
      if (!folderHandle) return;

      this.showProgress(true);
      await this.indexFolder(folderHandle);
      this.showProgress(false);
      
      alert('Folder indexed successfully!');
    } catch (error) {
      console.error('Error selecting folder:', error);
      alert('Error accessing folder. Please try again.');
      this.showProgress(false);
    }
  }

  private async indexFolder(folderHandle: FileSystemDirectoryHandle): Promise<void> {
    const files: File[] = [];
    
    // Collect all files
    for await (const file of this.fileSystemProvider.listFiles(folderHandle)) {
      files.push(file);
    }

    if (files.length === 0) return;

    let processed = 0;
    
    for (const file of files) {
      try {
        await this.indexFile(file);
        processed++;
        this.updateProgress(processed, files.length);
      } catch (error) {
        console.warn(`Failed to index ${file.name}:`, error);
      }
    }
  }

  private async indexFile(file: File): Promise<void> {
    const hash = await this.generateFileHash(file);
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    const extractor = this.extractors.get(extension);
    if (!extractor) return;

    const metadata = this.createFileMetadata(file, hash);
    const document = await extractor.extract(file, metadata);

    await this.storageProvider.saveFile(metadata);
    await this.storageProvider.saveDocument(document);

    this.searchEngine.setMetadata(metadata.id, metadata);
    await this.searchEngine.addDocuments([document]);
  }

  private async handleSearch(query: string): Promise<void> {
    if (!query.trim()) {
      this.displayResults([]);
      return;
    }

    try {
      const results = await this.searchEngine.search({ text: query, limit: 20 });
      this.displayResults(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  private displayResults(results: SearchResult[]): void {
    const container = document.getElementById('results-container');
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = '<p class="no-results">No results found</p>';
      return;
    }

    container.innerHTML = results
      .map(result => `
        <div class="result-item">
          <h3 class="result-title">${result.metadata.name}</h3>
          <div class="result-snippets">
            ${result.snippets.map(snippet => `
              <div class="snippet">${this.highlightText(snippet.text)}</div>
            `).join('')}
          </div>
          <div class="result-meta">
            Score: ${result.score.toFixed(2)} | 
            Type: ${result.metadata.type} |
            Size: ${this.formatFileSize(result.metadata.size)}
          </div>
        </div>
      `).join('');
  }

  // Utility methods
  private async generateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private createFileMetadata(file: File, hash: string) {
    const parts = file.name.split('.');
    const extension = parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';

    return {
      id: crypto.randomUUID(),
      path: file.webkitRelativePath || file.name,
      name: file.name,
      extension,
      size: file.size,
      lastModified: file.lastModified,
      type: this.getFileType(extension),
      hash,
    };
  }

  private showProgress(show: boolean): void {
    const progress = document.getElementById('indexing-progress');
    if (progress) {
      progress.className = show ? 'progress-visible' : 'progress-hidden';
    }
  }

  private updateProgress(processed: number, total: number): void {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    const percentage = (processed / total) * 100;
    
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
      progressText.textContent = `Indexing files... ${processed}/${total}`;
    }
  }

  private highlightText(text: string): string {
    // Simple highlight implementation
    return text.replace(/[<>&]/g, (char) => {
      const entities: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;' };
      return entities[char];
    });
  }

  private formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unit = 0;
    
    while (size >= 1024 && unit < units.length - 1) {
      size /= 1024;
      unit++;
    }
    
    return `${size.toFixed(1)} ${units[unit]}`;
  }

  private getFileType(extension: string): FileType {
    const typeMap: Record<string, FileType> = {
      pdf: 'pdf',
      docx: 'docx',
      txt: 'txt',
      md: 'md',
      csv: 'csv',
      html: 'html',
    };
    
    return typeMap[extension] || 'unknown';
  }
}