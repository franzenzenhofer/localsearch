import { LocalSearchApp } from '../../app/LocalSearchApp.js';
import '../../styles/main.css';

declare const browser: any;

// Extension-specific initialization
const app = new LocalSearchApp();
app.initialize();

// Firefox storage integration
browser.storage.local.get(['searchHistory']).then(() => {
  console.log('Extension search history loaded');
});