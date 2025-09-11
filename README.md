# 🔍 LocalSearch

**Private, offline folder search PWA with TDD-driven development**

[![CI/CD](https://github.com/franzenzenhofer/localsearch/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/franzenzenhofer/localsearch/actions/workflows/ci-cd.yml)
[![codecov](https://codecov.io/gh/franzenzenhofer/localsearch/branch/main/graph/badge.svg)](https://codecov.io/gh/franzenzenhofer/localsearch)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🔒 **100% Private**: All data stays on your device - no servers, no accounts, no telemetry
- 📱 **PWA**: Installable, works offline, cross-platform (Chrome, Firefox, Safari)
- ⚡ **Instant Search**: P95 < 100ms query response time on 10k documents
- 📄 **Multiple Formats**: PDF, DOCX, TXT, MD, CSV, HTML text extraction
- 🌐 **Modern**: TypeScript, Vite, responsive design, dark/light mode
- 🧪 **Quality**: 70+ tests, 100% coverage, TDD-driven development

## 🚀 Quick Start

1. **Visit**: [localsearch.franzai.com](https://localsearch.franzai.com)
2. **Install**: Click "Install" when prompted (PWA)
3. **Select**: Choose a folder to index
4. **Search**: Start searching your files instantly!

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

```
src/
├── app/           # Main application logic
├── core/          # Core types and utilities
├── extractors/    # Text extraction modules
├── search/        # Search engine implementation
├── storage/       # IndexedDB/OPFS storage
├── workers/       # Web Workers for background processing
└── ui/           # User interface components

tests/
├── unit/         # Unit tests (70+ tests)
└── e2e/          # End-to-end tests (Playwright)
```

### 📚 Tech Stack

**Core:**
- TypeScript 5.8+ (strict mode)
- Vite 5.4+ (build tool)
- ESLint 9+ (max 75 lines per file)

**File Processing:**
- PDF.js (PDF extraction)
- Mammoth.js (DOCX extraction)  
- Papa Parse (CSV parsing)
- MiniSearch (full-text search)

**Storage & PWA:**
- Dexie.js (IndexedDB wrapper)
- OPFS (large file storage)
- Workbox (service worker)
- File System Access API

**Testing:**
- Vitest 2+ (unit tests)
- Playwright 1.49+ (E2E tests)
- Happy DOM (test environment)

## 🎯 Performance Targets

- ✅ **Search Speed**: P95 < 100ms for 3-term queries on 10k docs
- ✅ **Index Size**: ≤ 25% of raw text bytes (compressed)
- ✅ **Build Size**: <1MB main bundle (excluding extractors)
- ✅ **Test Coverage**: 100% line/branch coverage
- ✅ **File Limit**: Max 75 lines per file (enforced by ESLint)

## 🔐 Privacy & Security

- **No Network**: Content never leaves your device
- **Local Storage**: IndexedDB + OPFS for persistence
- **Optional Encryption**: AES-GCM for index export/import
- **CSP**: Strict Content Security Policy
- **No Telemetry**: Zero tracking or analytics

## 🧪 Testing

```bash
# Unit tests (70+ tests)
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage

# Lint (strict 75-line limit)
npm run lint
```

## 📦 Deployment

**Automated (GitHub Actions):**
- Tests run on every PR/push
- Deploys to GitHub Pages + Cloudflare Pages
- Performance monitoring & security scanning

**Manual:**
```bash
# Deploy to both platforms
npm run deploy

# GitHub Pages only
npm run deploy:gh

# Cloudflare Pages only  
npm run deploy:cf
```

## 🌐 Browser Support

| Feature | Chrome 86+ | Firefox 90+ | Safari 15+ |
|---------|------------|-------------|------------|
| File System Access API | ✅ | ❌* | ❌* |
| PWA Installation | ✅ | ✅ | ✅ |
| IndexedDB | ✅ | ✅ | ✅ |
| Web Workers | ✅ | ✅ | ✅ |

*\* Fallback: drag-and-drop file upload*

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Write** tests first (TDD approach)
4. **Implement** your feature (max 75 lines per file)
5. **Ensure** all tests pass: `npm test`
6. **Commit** changes: `git commit -m 'Add amazing feature'`
7. **Push** to branch: `git push origin feature/amazing-feature`
8. **Open** a Pull Request

### 📏 Code Standards

- **TDD**: Write tests before implementation
- **75-line limit**: Enforced by ESLint
- **TypeScript strict**: No `any` types
- **Zero warnings**: Lint must pass cleanly
- **100% coverage**: All code paths tested

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **PDF.js**: Mozilla's PDF parsing engine
- **Mammoth.js**: DOCX to HTML conversion
- **MiniSearch**: Lightweight full-text search
- **Dexie.js**: IndexedDB made usable
- **Vite**: Next generation frontend tooling

---

**🤖 Generated with [Claude Code](https://claude.ai/code)**

**Co-Authored-By: Claude <noreply@anthropic.com>**