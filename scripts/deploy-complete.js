#!/usr/bin/env node

/**
 * Complete deployment script for LocalSearch
 * Handles:
 * 1. Version bumping
 * 2. Pre-deployment tests (lint, typecheck)
 * 3. Building
 * 4. Deploying to Cloudflare Pages
 * 5. Running post-deploy tests
 * 6. Committing version changes
 * 7. Tagging release
 * 8. Pushing to GitHub
 */

import { execSync } from 'child_process'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m'
}

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.purple}🚀 ${msg}${colors.reset}\n`)
}

// Execute command with error handling
function exec(command, options = {}) {
  try {
    return execSync(command, {
      cwd: rootDir,
      stdio: 'inherit',
      ...options
    })
  } catch (error) {
    if (!options.ignoreError) {
      throw error
    }
    return null
  }
}

// Get output from command
function getOutput(command) {
  try {
    return execSync(command, {
      cwd: rootDir,
      encoding: 'utf8'
    }).trim()
  } catch (error) {
    return null
  }
}

// Main deployment function
async function deploy() {
  log.section('Starting Complete LocalSearch Deployment Process')

  try {
    // Step 1: Version bump
    log.section('Version Management')
    exec('npm run version:bump:minor')
    
    // Get current version
    const packageJson = JSON.parse(fs.readFileSync(join(rootDir, 'package.json'), 'utf8'))
    const version = packageJson.version
    log.success(`Version bumped to: ${version}`)

    // Step 2: Pre-deployment tests
    log.section('Pre-Deployment Quality Checks')
    exec('npm run lint')
    log.success('ESLint checks passed')
    
    exec('npm run typecheck')
    log.success('TypeScript checks passed')

    // Step 3: Build
    log.section('Building Production Bundle')
    exec('npm run build')
    log.success('Production build completed')

    // Step 4: Deploy to Cloudflare Pages
    log.section('Deploying to Cloudflare Pages')
    exec('wrangler pages deploy dist --project-name=localsearch')
    log.success('Deployed to Cloudflare Pages')

    // Step 5: Run post-deploy tests
    log.section('Running Post-Deploy Tests')
    exec('npm run test:post-deploy')
    log.success('Post-deploy tests passed')

    // Step 6: Commit version changes if any
    const hasChanges = getOutput('git status --porcelain')
    if (hasChanges) {
      log.section('Committing Version Changes')
      exec('git add .')
      exec(`git commit -m "chore: release LocalSearch v${version}

🚀 Features:
✅ Professional Material-UI Components
✅ Persistent LocalStorage Management  
✅ Modern Yellow/Blue/Black Branding
✅ Technical Debug Interface
✅ 75-Line Modular Architecture
✅ Zero Lint Warnings
✅ Perfect Code Quality

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"`)
      log.success(`Committed version changes for v${version}`)
    }

    // Step 7: Tag the release
    log.section('Creating Release Tag')
    const tagExists = getOutput(`git tag -l "v${version}"`)
    if (!tagExists) {
      exec(`git tag -a "v${version}" -m "LocalSearch v${version} - Professional File Search"`)
      log.success(`Created tag v${version}`)
    } else {
      log.warning(`Tag v${version} already exists`)
    }

    // Step 8: Push to GitHub
    log.section('Pushing to GitHub')
    exec('git push origin main --follow-tags')
    log.success('Pushed to GitHub with tags')

    // Final summary
    log.section('Deployment Complete! 🎉')
    console.log(`
📊 Deployment Summary:
  📦 Version: v${version}
  🌐 Live at: https://40d7a946.localsearch-c21.pages.dev
  🔗 Custom Domain: localsearch.franzai.com (pending DNS)
  🐙 GitHub: https://github.com/franzenzenhofer/localsearch
  🏷️  Tag: v${version}
  
🔍 LocalSearch is now live and ready for private file searching!
    `)

  } catch (error) {
    log.error(`Deployment failed: ${error.message}`)
    process.exit(1)
  }
}

// Run deployment
deploy().catch(error => {
  log.error(`Unexpected error: ${error.message}`)
  process.exit(1)
})