import { LocalSearchApp } from '../../app/LocalSearchApp.js';
import '../../styles/main.css';

// Safari global type declaration
declare const safari: unknown;

// Extension-specific initialization
const app = new LocalSearchApp();
app.initialize();

// Safari storage integration
if (typeof safari !== 'undefined') {
  console.log('Safari extension initialized');
}