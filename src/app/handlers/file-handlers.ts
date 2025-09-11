import type { LocalSearchApp } from '../LocalSearchApp.js';

export function setupFileHandlers(app: LocalSearchApp): void {
  const folderBtn = document.getElementById('select-folder-btn');
  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  const fileBtn = document.getElementById('file-select-btn');

  if (folderBtn) {
    folderBtn.addEventListener('click', async () => {
      await app.handleFolderSelection();
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        await app.handleFileSelection(Array.from(files));
      }
    });
  }

  if (fileBtn) {
    fileBtn.addEventListener('click', () => {
      fileInput?.click();
    });
  }
}