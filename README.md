# LocalSearch 🔍

> **Private, offline file search powered by Material-UI and modern React**

LocalSearch is a professional React-based Progressive Web App (PWA) that enables instant, private searching through your documents without ever sending data to external servers. Built with Material-UI components and hardcore modular architecture.

[![CI/CD](https://github.com/franzenzenhofer/localsearch/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/franzenzenhofer/localsearch/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **🔒 100% Private** - All processing happens locally in your browser
- **⚡ Instant Search** - Sub-second search results across all file types
- **📱 Mobile-First** - Professional responsive design for all devices
- **🚀 PWA Ready** - Install as an app, works offline
- **🎯 Multiple Formats** - PDF, DOCX, TXT, MD, CSV, HTML support
- **💎 Material-UI** - Professional business components only
- **🔧 Debug View** - Technical interface showing core app internals
- **📏 75-Line Limit** - Hardcore modular architecture

## 🚀 Live Demo

**Production:** [localsearch.franzai.com](https://localsearch.franzai.com)

1. **Visit** the live demo
2. **Upload** your documents
3. **Search** instantly - all private!
4. **Install** as PWA for offline use

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/franzenzenhofer/localsearch.git
cd localsearch

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🏗️ Architecture

### Frontend/Backend Separation

- **SearchFacade** - Complete abstraction layer for core logic reusability
- **Material-UI Components** - Professional, mature component library
- **React 19+** - Modern JSX automatic runtime
- **TypeScript Strict** - Zero tolerance error policy
- **75-Line Limit** - Hardcore modular architecture enforced

### Project Structure

```
src/
├── components/          # React components (<75 lines each)
│   ├── AppHeader.tsx   # Material-UI header
│   ├── SearchBar.tsx   # Professional search input
│   └── ...
├── core/               # Business logic (framework-agnostic)
│   ├── SearchFacade.ts # Main API abstraction
│   └── types.ts        # Type definitions
├── hooks/              # React hooks
└── search/             # Search engine implementation
```

### Core Technologies

```
Frontend:  React + Material-UI + TypeScript
Search:    MiniSearch + Web Workers
Storage:   IndexedDB via Dexie
Parsing:   PDF.js, Mammoth, Papa Parse
Build:     Vite + PWA Plugin
Deploy:    Cloudflare Pages
```

## 🏆 Performance

- **Build Size**: ~1.3MB (PWA with workers)
- **Search Speed**: <100ms for 1000+ documents
- **Mobile Performance**: Optimized for low-end devices
- **Memory Usage**: Efficient IndexedDB storage
- **Code Quality**: 75-line limit, zero warnings

## 📄 Supported File Types

| Format   | Extension | Parser     |
| -------- | --------- | ---------- |
| PDF      | `.pdf`    | PDF.js     |
| Word     | `.docx`   | Mammoth    |
| Text     | `.txt`    | Native     |
| Markdown | `.md`     | Native     |
| CSV      | `.csv`    | Papa Parse |
| HTML     | `.html`   | DOMParser  |

## 🔧 API Usage

### SearchFacade Core API

```typescript
import { SearchFacade } from "./core/SearchFacade";

const facade = new SearchFacade({
  onProgress: (current, total) => console.log(`${current}/${total}`),
  onError: (error) => console.error(error),
});

// Index files
await facade.indexFiles(fileList);

// Search
const results = await facade.search("query text", 20);

// Get stats
console.log("Files indexed:", facade.getFileCount());
```

### Debug Interface

Enable debug mode to see:

- Core app method calls
- Search engine internals
- File processing pipeline
- Performance metrics
- **Force Update** - Clear all caches and force reload latest version

#### Force Update Feature

If you're stuck on an old cached version of the app:

1. Open the **Debug Interface** (bottom-right Debug button)
2. Expand **"Force Update"** section
3. Click **"Force Update & Reload"** button
4. The app will clear all caches and reload with the latest version

This is especially useful when the service worker is serving stale content.

## 📋 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint (zero warnings)
npm run test         # Run test suite
npm run deploy       # Full deployment pipeline
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Ensure all files are <75 lines
4. Run `npm run lint` (must pass with zero warnings)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open Pull Request

### Code Quality Standards

- **75-line file limit** - No exceptions
- **Zero warnings** - TypeScript strict + ESLint max-warnings 0
- **100% DRY** - No code repetition
- **Material-UI only** - No custom icons or components

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

- **Material-UI**: MIT License
- **React**: MIT License
- **TypeScript**: Apache License 2.0
- **PDF.js**: Apache License 2.0
- **Mammoth**: BSD-2-Clause License
- **Papa Parse**: MIT License

## 🙏 Acknowledgments

- **Material-UI Team** - Professional React components
- **Vite Team** - Lightning-fast build tool
- **Cloudflare** - Edge deployment platform
- **Franz Enzenhofer** - Project architect & maintainer

## 🔗 Links

- **Live App**: [localsearch.franzai.com](https://localsearch.franzai.com)
- **GitHub**: [github.com/franzenzenhofer/localsearch](https://github.com/franzenzenhofer/localsearch)
- **Issues**: [Report bugs or request features](https://github.com/franzenzenhofer/localsearch/issues)

---

**Built with ❤️ using professional open source libraries**

_Standing on the shoulders of giants - using only mature, battle-tested components_
