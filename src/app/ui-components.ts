export function createHeader(): string {
  return `
    <header class="header">
      <h1>LocalSearch</h1>
      <p>Private, offline folder search</p>
      <button id="theme-toggle" class="theme-toggle">Toggle Theme</button>
    </header>
  `;
}

export function createSearchSection(): string {
  return `
    <div class="search-section">
      <div class="search-bar">
        <input type="text" id="search-input" placeholder="Search your files..." />
        <button id="search-btn" type="button">Search</button>
      </div>
    </div>
  `;
}

export function createFileSection(): string {
  return `
    <div class="folder-section">
      <button id="select-folder-btn" type="button">Select Folder to Index</button>
      <input type="file" id="file-input" multiple 
        accept=".pdf,.docx,.txt,.md,.csv,.html" style="display: none;">
      <button id="file-select-btn" type="button">Select Files</button>
      
      <div id="indexing-progress" class="progress-hidden">
        <div class="progress-bar">
          <div id="progress-fill" class="progress-fill"></div>
        </div>
        <div id="progress-text">Indexing files...</div>
      </div>
    </div>
    
    <div class="stats-section">
      <div id="file-stats" class="stats">Ready to index files</div>
    </div>
  `;
}

export function createResultsSection(): string {
  return `
    <div class="results-section">
      <div id="results-container"></div>
    </div>
  `;
}