import { UI_TEMPLATES } from './ui-templates.js';

export function setupUI(): void {
  const app = document.querySelector('#app');
  if (!app) return;

  app.innerHTML = UI_TEMPLATES.MAIN_LAYOUT;
}

export { updateProgress, updateStats } from './ui-updaters.js';