import type { LocalSearchApp } from './LocalSearchApp.js';
import { setupSearchHandlers } from './handlers/search-handlers.js';
import { setupFileHandlers } from './handlers/file-handlers.js';
import { setupThemeHandler } from './handlers/theme-handler.js';

export function setupEventListeners(app: LocalSearchApp): void {
  setupSearchHandlers(app);
  setupFileHandlers(app);
  setupThemeHandler();
}