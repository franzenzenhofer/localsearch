import type { LocalSearchApp } from '../LocalSearchApp.js';

export function setupSearchHandlers(app: LocalSearchApp): void {
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const searchBtn = document.getElementById('search-btn');

  if (!searchInput || !searchBtn) return;

  searchInput.addEventListener('input', async (event) => {
    const query = (event.target as HTMLInputElement).value.trim();
    if (query.length > 2) {
      await app.performSearch(query);
    } else {
      app.clearResults();
    }
  });

  searchBtn.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (query) {
      await app.performSearch(query);
    }
  });

  searchInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        await app.performSearch(query);
      }
    }
  });
}