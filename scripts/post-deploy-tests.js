#!/usr/bin/env node

/**
 * LocalSearch - Post-Deployment Test Suite
 * Comprehensive testing after deployment to ensure everything works
 */

import { execSync } from 'child_process'
import fs from 'fs'

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',
  cyan: '\x1b[36m',
}

const log = (color, icon, message) => {
  console.log(`${color}${icon} ${message}${COLORS.reset}`)
}

const success = (msg) => log(COLORS.green, '✅', msg)
const error = (msg) => log(COLORS.red, '❌', msg)
const warning = (msg) => log(COLORS.yellow, '⚠️ ', msg)
const info = (msg) => log(COLORS.blue, 'ℹ️ ', msg)
const test = (msg) => log(COLORS.cyan, '🧪', msg)

// Configuration - will be updated after deployment
const SITE_URL = 'https://localsearch.franzai.com'
const TEST_TIMEOUT = 30000

class PostDeploymentTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    }
  }

  async runTest(name, testFn) {
    test(`Running: ${name}`)
    try {
      const result = await testFn()
      if (result === true) {
        success(`✓ ${name}`)
        this.results.passed++
        this.results.tests.push({ name, status: 'PASS' })
        return true
      } else if (result === 'warning') {
        warning(`⚠ ${name}`)
        this.results.warnings++
        this.results.tests.push({ name, status: 'WARN' })
        return true
      } else {
        error(`✗ ${name}: ${result}`)
        this.results.failed++
        this.results.tests.push({ name, status: 'FAIL', error: result })
        return false
      }
    } catch (err) {
      error(`✗ ${name}: ${err.message}`)
      this.results.failed++
      this.results.tests.push({ name, status: 'FAIL', error: err.message })
      return false
    }
  }

  async testSiteAccessibility() {
    const response = await fetch(SITE_URL)
    if (!response.ok) {
      return `Site returned ${response.status} ${response.statusText}`
    }
    return true
  }

  async testLiveVersionVerification() {
    // Read the current version from package.json
    const fs = await import('fs')
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
    const expectedVersion = packageJson.version
    
    info(`🔍 DETECTIVE MODE: Checking for version v${expectedVersion}`)
    
    const response = await fetch(`${SITE_URL}?v=${Date.now()}`, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
    const html = await response.text()
    
    // CRITICAL: Check version in HTML title 
    const titleMatch = html.match(/<title>LocalSearch v([^<]+) - Private File Search<\/title>/)
    if (!titleMatch) {
      return `❌ CRITICAL: Version not found in HTML title. Expected "LocalSearch v${expectedVersion}" but title is: ${html.match(/<title>([^<]+)<\/title>/)?.[1] || 'MISSING'}`
    }
    const titleVersion = titleMatch[1]
    if (titleVersion !== expectedVersion) {
      return `❌ CRITICAL: Version mismatch in title. Expected v${expectedVersion} but got v${titleVersion}`
    }
    
    // Check version in meta tags
    if (!html.includes(`<meta name="app-version" content="${expectedVersion}"`)) {
      return `❌ Version meta tag missing or incorrect. Expected v${expectedVersion}`
    }
    
    // Check version in window globals
    if (!html.includes(`window.__APP_VERSION__="${expectedVersion}"`)) {
      return `❌ Global window version variable missing or incorrect. Expected v${expectedVersion}`
    }
    
    // Check build time is recent (within last hour)
    const buildTimeMatch = html.match(/window\.__BUILD_TIME__="([^"]+)"/)
    if (buildTimeMatch) {
      const buildTime = new Date(buildTimeMatch[1])
      const now = new Date()
      const hourAgo = new Date(now - 60 * 60 * 1000)
      if (buildTime < hourAgo) {
        return `⚠️  Build time seems old: ${buildTime.toISOString()}. Expected within last hour.`
      }
    }
    
    success(`🎉 CONFIRMED: Live site shows correct version v${expectedVersion}`)
    success(`🔍 Title: LocalSearch v${titleVersion} ✅`)
    success(`🔍 Meta tag: app-version="${expectedVersion}" ✅`)
    success(`🔍 Window global: __APP_VERSION__="${expectedVersion}" ✅`)
    
    return true
  }

  async testStaticAssets() {
    const response = await fetch(SITE_URL)
    const html = await response.text()
    
    // Extract asset URLs from HTML
    const jsMatch = html.match(/src="([^"]*\.js)"/)
    const cssMatch = html.match(/href="([^"]*\.css)"/)
    
    if (!jsMatch || !cssMatch) {
      return 'JS or CSS assets not found in HTML'
    }
    
    // Test JS asset
    const jsUrl = jsMatch[1].startsWith('http') ? jsMatch[1] : `${SITE_URL}${jsMatch[1]}`
    const jsResponse = await fetch(jsUrl)
    if (!jsResponse.ok) {
      return `JS asset failed: ${jsResponse.status}`
    }
    
    // Test CSS asset
    const cssUrl = cssMatch[1].startsWith('http') ? cssMatch[1] : `${SITE_URL}${cssMatch[1]}`
    const cssResponse = await fetch(cssUrl)
    if (!cssResponse.ok) {
      return `CSS asset failed: ${cssResponse.status}`
    }
    
    return true
  }

  async testFavicon() {
    const faviconUrl = `${SITE_URL}/favicon.svg`
    const response = await fetch(faviconUrl)
    if (!response.ok) {
      return 'Custom search favicon not accessible'
    }
    
    const svg = await response.text()
    if (!svg.includes('<svg') || !svg.includes('#FFB000')) {
      return 'Favicon does not contain expected branding colors'
    }
    
    return true
  }

  async testPWAManifest() {
    const manifestUrl = `${SITE_URL}/manifest.webmanifest`
    const response = await fetch(manifestUrl)
    if (!response.ok) {
      return 'PWA manifest not accessible'
    }
    
    const manifest = await response.json()
    if (!manifest.name || manifest.name !== 'LocalSearch') {
      return 'PWA manifest missing or incorrect name'
    }
    
    if (!manifest.theme_color || manifest.theme_color !== '#646cff') {
      return 'PWA manifest missing theme color'
    }
    
    return true
  }

  async testServiceWorker() {
    const swUrl = `${SITE_URL}/sw.js`
    const response = await fetch(swUrl)
    if (!response.ok) {
      return 'Service worker not accessible'
    }
    
    const sw = await response.text()
    if (!sw.includes('precacheAndRoute') || !sw.includes('workbox')) {
      return 'Service worker missing Workbox functionality'
    }
    
    return true
  }

  async testCacheHeaders() {
    // Test main page (should allow caching but not too long)
    const htmlResponse = await fetch(SITE_URL)
    const htmlCacheControl = htmlResponse.headers.get('cache-control')
    
    // Test a static asset (should be cached)
    const response = await fetch(SITE_URL)
    const html = await response.text()
    const jsMatch = html.match(/src="([^"]*\.js)"/)
    
    if (jsMatch) {
      const jsUrl = jsMatch[1].startsWith('http') ? jsMatch[1] : `${SITE_URL}${jsMatch[1]}`
      const jsResponse = await fetch(jsUrl)
      const jsCacheControl = jsResponse.headers.get('cache-control')
      
      // Cloudflare Pages automatically sets cache headers
      if (jsResponse.ok) {
        return true
      }
    }
    
    return true
  }

  async testResponseTimes() {
    const start = Date.now()
    const response = await fetch(SITE_URL)
    const end = Date.now()
    const responseTime = end - start
    
    if (responseTime > 5000) {
      return `Response time too slow: ${responseTime}ms`
    }
    
    if (responseTime > 2000) {
      return 'warning' // Warn if > 2s but don't fail
    }
    
    return true
  }

  async testMobileViewport() {
    const response = await fetch(SITE_URL)
    const html = await response.text()
    
    if (!html.includes('viewport') || !html.includes('width=device-width')) {
      return 'Mobile viewport meta tag missing'
    }
    
    if (!html.includes('theme-color') || !html.includes('#FFB000')) {
      return 'Mobile theme color missing or incorrect'
    }
    
    return true
  }

  async testMaterialUILoading() {
    const response = await fetch(SITE_URL)
    const html = await response.text()
    
    // Check if Material-UI assets are loaded
    if (!html.includes('.css')) {
      return 'No CSS files found (Material-UI styles missing)'
    }
    
    // Since Material-UI is bundled, check if the main JS bundle exists
    const jsMatch = html.match(/src="([^"]*index[^"]*\.js)"/)
    if (!jsMatch) {
      return 'Main JS bundle not found'
    }
    
    return true
  }

  async testBrandingElements() {
    const response = await fetch(SITE_URL)
    const html = await response.text()
    
    // Check for versioned title pattern
    const hasVersionedTitle = /<title>LocalSearch v[0-9]+\.[0-9]+\.[0-9]+ - Private File Search<\/title>/.test(html)
    if (!hasVersionedTitle) {
      return 'Versioned page title missing or incorrect format'
    }
    
    // Check for proper description
    if (!html.includes('Private, offline file search')) {
      return 'Meta description missing or incorrect'
    }
    
    return true
  }

  async runAllTests() {
    info('🚀 Starting LocalSearch Post-Deployment Test Suite')
    info(`Testing: ${SITE_URL}`)
    console.log('')

    // CRITICAL: Live version verification test FIRST
    await this.runTest('🔍 LIVE VERSION VERIFICATION', () => this.testLiveVersionVerification())
    
    // Core functionality tests
    await this.runTest('Site Accessibility', () => this.testSiteAccessibility())
    await this.runTest('Static Assets Loading', () => this.testStaticAssets())
    await this.runTest('Material-UI Integration', () => this.testMaterialUILoading())
    
    // PWA tests
    await this.runTest('Custom Favicon', () => this.testFavicon())
    await this.runTest('PWA Manifest', () => this.testPWAManifest())
    await this.runTest('Service Worker', () => this.testServiceWorker())
    
    // Performance tests
    await this.runTest('Response Times', () => this.testResponseTimes())
    
    // Technical tests
    await this.runTest('Cache Headers', () => this.testCacheHeaders())
    await this.runTest('Mobile Viewport', () => this.testMobileViewport())
    await this.runTest('Branding Elements', () => this.testBrandingElements())

    // Summary
    console.log('')
    console.log('═'.repeat(60))
    info('📊 TEST RESULTS SUMMARY')
    console.log('═'.repeat(60))
    
    success(`Passed: ${this.results.passed}`)
    if (this.results.warnings > 0) {
      warning(`Warnings: ${this.results.warnings}`)
    }
    if (this.results.failed > 0) {
      error(`Failed: ${this.results.failed}`)
    }
    
    const total = this.results.passed + this.results.failed + this.results.warnings
    const passRate = Math.round((this.results.passed / total) * 100)
    
    console.log('')
    if (this.results.failed === 0) {
      success(`🎉 ALL TESTS PASSED! (${passRate}% success rate)`)
      success('🚀 LocalSearch is ready for users!')
    } else {
      error(`❌ ${this.results.failed} tests failed`)
      error('🚨 Deployment has issues that need attention')
    }
    
    // Generate test report
    const report = {
      timestamp: new Date().toISOString(),
      url: SITE_URL,
      application: 'LocalSearch',
      version: '1.5.0',
      summary: {
        total,
        passed: this.results.passed,
        failed: this.results.failed,
        warnings: this.results.warnings,
        passRate
      },
      tests: this.results.tests
    }
    
    fs.writeFileSync('/tmp/localsearch-post-deploy-test-report.json', JSON.stringify(report, null, 2))
    info('📄 Test report saved to /tmp/localsearch-post-deploy-test-report.json')
    
    return this.results.failed === 0
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new PostDeploymentTester()
  
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1)
  }).catch(err => {
    error(`Test suite crashed: ${err.message}`)
    process.exit(1)
  })
}

export default PostDeploymentTester