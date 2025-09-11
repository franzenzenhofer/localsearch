import './style.css';
import { LocalSearchApp } from './app/LocalSearchApp';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new LocalSearchApp();
  app.initialize();
});
