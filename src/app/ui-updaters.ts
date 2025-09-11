export function updateProgress(current: number, total: number): void {
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const progressContainer = document.getElementById('indexing-progress');

  if (!progressFill || !progressText || !progressContainer) return;

  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  if (total > 0) {
    progressContainer.className = 'progress-visible';
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `Indexing files... (${current}/${total})`;
  } else {
    progressContainer.className = 'progress-hidden';
  }
}

export function updateStats(fileCount: number): void {
  const stats = document.getElementById('file-stats');
  if (!stats) return;

  if (fileCount > 0) {
    stats.textContent = `${fileCount} files indexed`;
  } else {
    stats.textContent = 'Ready to index files';
  }
}