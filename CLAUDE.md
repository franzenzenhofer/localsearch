# LocalSearch - Private File Search Application

## 🎯 OVERVIEW
LocalSearch is a powerful Progressive Web Application (PWA) that enables private, offline file searching. Built with React, TypeScript, and Material-UI, featuring superhero-themed design with yellow/blue/black/white color scheme.

## ✨ FEATURES
- **🗂️ Folder Upload**: Primary action - select entire folders (feature detection for browser support)
- **📄 File Upload**: Secondary action - select individual files when folder upload unavailable
- **🔍 Advanced Search**: Full-text search with MiniSearch engine
- **💾 Persistent Storage**: IndexedDB via Dexie for offline capability
- **📱 PWA Features**: Service worker, manifest, installable
- **🎨 Superhero Theme**: Bold yellow/blue/black/white color scheme
- **♿ Accessibility**: Feature detection with graceful degradation
- **🏗️ Component Architecture**: Modular, maintainable codebase

## 🚀 QUICK START

### Prerequisites
```bash
node >= 16
npm >= 8
```

### Installation
```bash
git clone <repository>
cd localsearch
npm install
```

### Development
```bash
npm run dev          # Start development server
npm run lint         # Check code quality
npm run typecheck    # Validate TypeScript
```

### Production Deployment
**🚨 CRITICAL: ALWAYS USE npm run deploy - NEVER use wrangler deploy directly!**

```bash
npm run deploy       # Complete automated deployment pipeline
```

**🌐 DEPLOYMENT TARGET: https://localsearch.franzai.com/**

This runs:
1. Version bump (minor)
2. Lint check (0 warnings required)
3. TypeScript check (strict mode)
4. Production build
5. Deploy to Cloudflare Pages (localsearch.franzai.com)
6. Post-deployment tests (11 comprehensive checks)
7. Git commit, tag, and push

**⚠️ DEPLOYMENT RULE - MANDATORY:**
- **ALWAYS use `npm run deploy` for ALL deployments**
- **NEVER use `wrangler deploy` directly**
- **Always deploys to localsearch.franzai.com custom domain**
- **Ensures all tests pass before deployment**
- **Includes automatic git commits and version tagging**

## 🛠️ ARCHITECTURE

### Core Components
```
src/
├── components/
│   ├── FolderUpload.tsx     # Primary folder selection with feature detection
│   ├── FileUpload.tsx       # Secondary file selection + main upload logic
│   ├── SearchBar.tsx        # Search interface
│   ├── SearchResults.tsx    # Results display
│   ├── IndexManager.tsx     # Saved indexes management
│   └── App*.tsx            # UI components
├── core/
│   ├── FileProcessor.ts     # File processing engine
│   ├── SearchFacade.ts      # Search orchestration
│   └── StorageManager.ts    # Persistent storage
├── hooks/
│   └── useSearch.ts         # Search state management
└── App.tsx                  # Main application with superhero theme
```

### Feature Detection
```typescript
// Browser capability detection
const isSupported = 'showDirectoryPicker' in window

// Graceful degradation
if (!isSupported) {
  // Show warning with browser requirements
  // Fall back to file-only selection
}
```

### Superhero Theme
```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#FFD700' },      // Superhero gold
    secondary: { main: '#1565C0' },    // Superhero blue  
    background: { default: '#FFFFFF' }, // Clean white
    text: { primary: '#000000' },      // Bold black
  }
})
```

## ⚡ HARDCORE MODULAR ARCHITECTURE

### 75-LINE LIMIT RULE - ZERO EXCEPTIONS
**EVERY FILE MUST BE UNDER 75 LINES - NO CODE FILE IS EXEMPT**

```bash
# ESLint enforces this automatically
"max-lines": ["error", { max: 75, skipBlankLines: true, skipComments: true }]
```

**MODULAR BREAKDOWN EXAMPLES:**
```typescript
// ❌ WRONG: 150-line component
export function MassiveComponent() {
  // 150 lines of mixed logic
}

// ✅ RIGHT: Broken into 3 focused modules
// Component.tsx (25 lines) - main component
// ComponentLogic.ts (35 lines) - business logic  
// ComponentStyles.ts (15 lines) - styling constants
```

**BENEFITS:**
- **Maintainability**: Each file has single responsibility
- **Readability**: Developers can grasp entire file at once
- **Testing**: Smaller modules = easier unit testing
- **Collaboration**: Less merge conflicts, cleaner PRs
- **Performance**: Better tree-shaking and bundling

**NO EXCEPTIONS - EVEN FOR:**
- Complex algorithms → Break into helper functions
- Large data structures → Split into separate files
- Generated code → Configure generators for 75-line chunks
- Third-party integrations → Create wrapper modules

## 🔧 CONFIGURATION

### Environment Variables
Create `.env.local` file:
```env
# Cloudflare Configuration (DO NOT COMMIT TO GIT)
CLOUDFLARE_API_TOKEN=your_api_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_ZONE_ID=your_zone_id_here

# Optional: Analytics
VITE_GA_ID=your_analytics_id
```

### Wrangler Configuration
```toml
# wrangler.toml
name = "localsearch"
main = "_worker.js"
compatibility_date = "2025-09-11"

[assets]
directory = "./dist"

[[routes]]
pattern = "localsearch.franzai.com/*"
zone_name = "franzai.com"
```

## 📦 DEPLOYMENT PIPELINE

### Cloudflare Pages + Custom Domain
```bash
# Automated deployment (RECOMMENDED)
npm run deploy

# Manual deployment (NOT recommended)
npm run build
wrangler deploy
```

### Deployment Checklist
- ✅ ESLint: 0 warnings
- ✅ TypeScript: strict mode
- ✅ Tests: 11/11 passing
- ✅ Version: auto-bumped
- ✅ Git: committed & tagged
- ✅ CDN: assets optimized
- ✅ SSL: certificate active
- ✅ PWA: service worker registered

## 🧪 TESTING

### Pre-deployment Tests
```bash
npm run lint         # Code quality (max-warnings: 0)
npm run typecheck    # Type safety
npm run test         # Unit tests (if configured)
```

### Post-deployment Tests
Automated verification after deployment:
- Site accessibility (200 response)
- React app loading (root element)
- Static assets (JS/CSS)
- Material-UI integration
- PWA features (manifest, service worker)
- Custom favicon
- Mobile viewport
- Response times (<2s warning, <5s fail)
- Cache headers
- Branding elements

## 🔐 SECURITY

### API Token Management
```bash
# NEVER commit tokens to git
echo "CLOUDFLARE_API_TOKEN=xxx" >> .env.local
echo ".env.local" >> .gitignore

# Use environment variables in scripts
process.env.CLOUDFLARE_API_TOKEN
```

### Content Security Policy
```javascript
// Vite configuration includes CSP headers
// PWA service worker handles caching securely
```

## 📚 FILE PROCESSING

### Supported Formats
- **PDF**: Text extraction via PDF.js
- **DOCX**: Document processing via Mammoth
- **TXT/MD**: Direct text processing
- **CSV**: Structured data via PapaParse
- **HTML**: DOM text extraction

### Processing Pipeline
1. File validation & type detection
2. Text extraction (format-specific)
3. Content indexing via MiniSearch
4. Metadata generation
5. Storage in IndexedDB
6. Search index optimization

## 🎨 DESIGN SYSTEM

### Superhero Color Palette
```css
/* Primary Colors */
--hero-gold: #FFD700;
--hero-blue: #1565C0;
--hero-black: #000000;
--hero-white: #FFFFFF;

/* Supporting Colors */
--bg-paper: #F8F9FA;
--text-secondary: #424242;
```

### Component Styling
- Bold borders (2-3px)
- Box shadows for depth
- High contrast ratios
- Accessible focus states
- Superhero-inspired interactions

## 🔍 SEARCH ENGINE

### MiniSearch Configuration
```typescript
const searchEngine = new MiniSearch({
  fields: ['content', 'title', 'filename'],
  storeFields: ['id', 'filename', 'content'],
  searchOptions: {
    boost: { title: 2, filename: 1.5 },
    fuzzy: 0.2,
    prefix: true
  }
})
```

### Search Features
- Full-text search
- Fuzzy matching
- Prefix matching
- Boost scoring
- Snippet extraction
- Metadata filtering

## 📱 PWA FEATURES

### Service Worker
- Asset caching strategy
- Offline functionality
- Background sync
- Cache-first for static assets
- Network-first for API calls

### Web App Manifest
```json
{
  "name": "LocalSearch",
  "short_name": "LocalSearch",
  "theme_color": "#FFD700",
  "background_color": "#FFFFFF",
  "display": "standalone",
  "start_url": "/",
  "icons": [...]
}
```

## 🚨 TROUBLESHOOTING

### Common Issues

#### Folder Selection Not Working
- **Cause**: Browser doesn't support `showDirectoryPicker`
- **Solution**: Feature detection shows warning, falls back to file selection
- **Browsers**: Chrome/Edge 86+, Safari (upcoming)

#### Deployment Fails
- **Cause**: ESLint warnings > 0
- **Solution**: Fix all warnings or adjust eslint config
- **Check**: `npm run lint` before deploying

#### Custom Domain 522 Error
- **Cause**: Worker not properly configured
- **Solution**: Ensure `_worker.js` exists and `wrangler.toml` routes correct

### Debug Mode
```typescript
// Enable debug view
<DebugView /> // Shows in development
```

## 📈 PERFORMANCE

### Optimization Features
- Code splitting via Vite
- Asset compression (gzip)
- Service worker caching
- Lazy component loading
- Optimized bundle sizes
- CDN delivery via Cloudflare

### Metrics
- First Contentful Paint: <2s
- Bundle size: <500KB gzipped
- Search response: <100ms
- File processing: Background workers

## 🤝 CONTRIBUTING

### Code Standards
- TypeScript strict mode
- ESLint max-warnings: 0
- 75-line function limit
- Component modularization
- Superhero design consistency

### Commit Process
```bash
# Before any commit
npm run quality:check    # lint + typecheck + tests

# For deployment
npm run deploy          # Automated pipeline
```

## 📄 LICENSE
MIT License - See LICENSE file for details

## 🌟 LIVE DEMO
**Production**: https://localsearch.franzai.com
**Features**: Full folder upload, PWA installation, offline search

---

*LocalSearch - Empowering private, superhero-fast file searching! 🚀*