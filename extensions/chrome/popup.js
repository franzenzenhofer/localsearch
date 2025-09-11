// MAXIMUM DRY - Import shared core functionality
import { ExtensionSearchCore } from '../shared/extension-core.js';

class LocalSearchExtension {
  constructor() {
    this.searchCore = new ExtensionSearchCore();
    this.initializeUI();
  }

  initializeUI() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const searchInput = document.getElementById('searchInput');
    const results = document.getElementById('results');
    const stats = document.getElementById('stats');
    const clearBtn = document.getElementById('clearIndex');

    // File drop handling
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', async (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      
      const files = Array.from(e.dataTransfer.files);
      await this.indexFiles(files);
    });

    // File input handling
    fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      await this.indexFiles(files);
    });

    // Search handling
    searchInput.addEventListener('input', async (e) => {
      const query = e.target.value.trim();
      if (query.length > 2) {
        await this.performSearch(query);
      } else {
        results.innerHTML = '';
      }
    });

    // Clear index
    clearBtn.addEventListener('click', async () => {
      await this.searchCore.clear();
      this.updateStats();
      results.innerHTML = '';
      searchInput.value = '';
    });

    this.updateStats();
  }

  async indexFiles(files) {
    let indexed = 0;
    
    for (const file of files) {
      if (await this.searchCore.indexFile(file)) {
        indexed++;
      }
    }
    
    this.updateStats();
    
    if (indexed > 0) {
      this.showMessage(`✅ Indexed ${indexed}/${files.length} files`);
    }
  }

  async performSearch(query) {
    const results = await this.searchCore.search(query);
    this.displayResults(results, query);
  }

  displayResults(results, query) {
    const resultsDiv = document.getElementById('results');
    
    if (results.length === 0) {
      resultsDiv.innerHTML = '<div style="text-align:center;color:#999;">No results found</div>';
      return;
    }

    resultsDiv.innerHTML = results.map((result, index) => `
      <div class="result-item">
        <div class="result-title">${result.title}</div>
        <div class="result-snippet">${result.snippet}</div>
        <div style="font-size:10px;color:#999;">Score: ${result.score.toFixed(2)}</div>
      </div>
    `).join('');
  }

  updateStats() {
    const count = this.searchCore.getIndexedCount();
    const stats = document.getElementById('stats');
    stats.textContent = count > 0 ? `${count} files indexed` : 'Ready to index files';
  }

  showMessage(text) {
    const stats = document.getElementById('stats');
    const original = stats.textContent;
    stats.textContent = text;
    stats.style.color = '#0a84ff';
    
    setTimeout(() => {
      stats.textContent = original;
      stats.style.color = '#999';
    }, 2000);
  }
}

// Initialize extension when popup loads
document.addEventListener('DOMContentLoaded', () => {
  new LocalSearchExtension();
});