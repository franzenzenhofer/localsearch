import { LocalSearchApp } from '../../app/LocalSearchApp.js';
import '../../styles/main.css';

declare const chrome: any;

// Extension-specific initialization
const app = new LocalSearchApp();
app.initialize();

// Extension storage integration
chrome.storage.local.get(['searchHistory'], () => {
  console.log('Extension search history loaded');
});