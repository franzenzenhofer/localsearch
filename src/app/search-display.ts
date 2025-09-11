import type { SearchResult } from '../core/types.js';

export function displayResults(results: SearchResult[]): void {
  const container = document.getElementById('results-container');
  if (!container) return;

  if (results.length === 0) {
    container.innerHTML = '<div class="no-results">No results found</div>';
    return;
  }

  const resultElements = results.map((result, index) => {
    const snippet = result.snippets && result.snippets.length > 0 
      ? result.snippets[0].text 
      : '';

    return `
      <div class="result-item" data-index="${index}">
        <div class="result-header">
          <h3 class="result-title">${escapeHtml(result.metadata.name)}</h3>
          <span class="result-score">Score: ${result.score.toFixed(2)}</span>
        </div>
        <div class="result-path">${escapeHtml(result.metadata.path)}</div>
        ${snippet ? `<div class="result-snippet">${escapeHtml(snippet)}</div>` : ''}
        <div class="result-meta">
          <span>Size: ${formatFileSize(result.metadata.size)}</span>
          <span>Modified: ${formatDate(new Date(result.metadata.lastModified))}</span>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="results-header">
      <h2>Search Results (${results.length})</h2>
    </div>
    <div class="results-list">
      ${resultElements}
    </div>
  `;
}

export function clearResults(): void {
  const container = document.getElementById('results-container');
  if (container) {
    container.innerHTML = '';
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}