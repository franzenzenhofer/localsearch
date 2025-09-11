export const UI_TEMPLATES = {
  MAIN_LAYOUT: `
    <div class="container">
      <header class="header">
        <h1>LocalSearch</h1>
        <p>Private, offline folder search</p>
        <button id="theme-toggle" class="theme-toggle">
          <span class="theme-icon">Light/Dark</span>
        </button>
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
          <input type="file" id="file-input" multiple 
            accept=".pdf,.docx,.txt,.md,.csv,.html" style="display: none;">
          <button id="file-select-btn" type="button">
            Select Files
          </button>
          
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
        
        <div class="results-section">
          <div id="results-container"></div>
        </div>
      </main>
    </div>
  `
};