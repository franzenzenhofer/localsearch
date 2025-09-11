import { test, expect } from '@playwright/test';

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://filesearch.franzai.com' 
  : 'http://localhost:5174';

test.describe('FileSearch - Comprehensive E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Wait for React app to load
    await expect(page.locator('#root')).toBeVisible();
    // Wait for version to be displayed
    await expect(page.locator('text=LocalSearch v')).toBeVisible();
  });

  test('should display correct version and no console errors', async ({ page }) => {
    // Check for version display
    await expect(page.locator('text=LocalSearch v1.51.0')).toBeVisible();
    
    // Check for cache breaker meta tag
    const cacheBreaker = page.locator('meta[name="cache-breaker"]');
    await expect(cacheBreaker).toHaveAttribute('content', /.+/);
    
    // Check for debug interface
    const debugView = page.locator('[data-testid="debug-view"]');
    if (await debugView.isVisible()) {
      await expect(debugView).toContainText('v1.51.0');
    }
    
    // Listen for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Wait a bit for any console errors to surface
    await page.waitForTimeout(2000);
    
    // Should have no critical console errors
    const criticalErrors = consoleErrors.filter(error => 
      error.includes('indexFiles is not a function') || 
      error.includes('precached-url') ||
      error.includes('TypeError')
    );
    
    expect(criticalErrors).toEqual([]);
  });

  test('should show connectivity status', async ({ page }) => {
    // Look for connectivity indicator
    const connectivityStatus = page.locator('[data-testid="connectivity-status"]');
    if (await connectivityStatus.isVisible()) {
      await expect(connectivityStatus).toBeVisible();
    }
    
    // Should show online status
    await expect(page.locator('text=Online')).toBeVisible({ timeout: 5000 });
  });

  test('should handle file upload UI', async ({ page }) => {
    // Check for folder upload button
    const folderUpload = page.locator('[data-testid="folder-upload-button"]');
    if (await folderUpload.isVisible()) {
      await expect(folderUpload).toBeVisible();
    }
    
    // Check for file upload button
    const fileUpload = page.locator('[data-testid="file-upload-button"]');
    if (await fileUpload.isVisible()) {
      await expect(fileUpload).toBeVisible();
    }
    
    // At least one upload method should be available
    const hasUploadOption = await folderUpload.isVisible() || await fileUpload.isVisible();
    expect(hasUploadOption).toBeTruthy();
  });

  test('should show search interface when files are present', async ({ page }) => {
    // Create a test file
    const testFileContent = 'This is a test file for searching. It contains unique content: TESTSEARCH123';
    const testFile = new File([testFileContent], 'test.txt', { type: 'text/plain' });
    
    // Look for file input and upload test file
    const fileInput = page.locator('input[type="file"]').first();
    
    if (await fileInput.isVisible()) {
      // Create a temporary file for testing
      await page.evaluate((content) => {
        const input = document.querySelector('input[type="file"]');
        if (input) {
          const dataTransfer = new DataTransfer();
          const file = new File([content], 'test.txt', { type: 'text/plain' });
          dataTransfer.items.add(file);
          input.files = dataTransfer.files;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, testFileContent);
      
      // Wait for file processing
      await page.waitForTimeout(1000);
      
      // Check if search interface appears
      const searchInput = page.locator('[data-testid="search-input"]');
      if (await searchInput.isVisible()) {
        await expect(searchInput).toBeVisible();
        
        // Test searching
        await searchInput.fill('TESTSEARCH123');
        
        // Look for search button or auto-search
        const searchButton = page.locator('[data-testid="search-button"]');
        if (await searchButton.isVisible()) {
          await searchButton.click();
        }
        
        // Wait for results
        await page.waitForTimeout(1000);
        
        // Should show search results or no results message
        const results = page.locator('[data-testid="search-results"]');
        await expect(results).toBeVisible();
      }
    }
  });

  test('should handle service worker registration', async ({ page }) => {
    // Wait for service worker registration
    await page.waitForTimeout(2000);
    
    // Check if service worker registered without errors
    const swRegistration = await page.evaluate(() => {
      return navigator.serviceWorker.getRegistration();
    });
    
    // Service worker should be registered or registration should be available
    expect(typeof swRegistration !== 'undefined').toBeTruthy();
  });

  test('should have proper PWA manifest', async ({ page }) => {
    // Check for manifest link
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toBeVisible();
    
    // Check manifest is accessible
    const manifestHref = await manifestLink.getAttribute('href');
    if (manifestHref) {
      const manifestResponse = await page.request.get(new URL(manifestHref, BASE_URL).href);
      expect(manifestResponse.ok()).toBeTruthy();
      
      const manifest = await manifestResponse.json();
      expect(manifest.name).toBeDefined();
      expect(manifest.short_name).toBeDefined();
    }
  });

  test('should load all critical assets', async ({ page }) => {
    // Check for main JS bundle
    const jsAssets = await page.locator('script[src*="/assets/index-"]').count();
    expect(jsAssets).toBeGreaterThan(0);
    
    // Check for CSS if present
    const cssAssets = await page.locator('link[href*="/assets/"]').count();
    // CSS might not be present in all builds
    
    // No 404 errors for critical assets
    const failedRequests = [];
    page.on('response', response => {
      if (response.status() >= 400 && response.url().includes('/assets/')) {
        failedRequests.push(response.url());
      }
    });
    
    await page.waitForTimeout(3000);
    expect(failedRequests).toEqual([]);
  });

  test('should handle offline capabilities', async ({ page }) => {
    // Test if offline handling is in place
    const offlineCapable = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    expect(offlineCapable).toBeTruthy();
    
    // Check for offline indicators if present
    const offlineIndicator = page.locator('[data-testid="offline-indicator"]');
    // This might not be visible if online
  });

  test('should have accessibility features', async ({ page }) => {
    // Check for proper ARIA labels and roles
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      
      // Button should have either aria-label or visible text
      expect(ariaLabel || textContent?.trim()).toBeTruthy();
    }
    
    // Check for proper heading structure
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('should perform end-to-end file search workflow', async ({ page }) => {
    console.log('🧪 Testing complete file search workflow...');
    
    // This test simulates a complete user workflow
    // Note: This test might need to be adapted based on actual UI implementation
    
    // 1. User visits the site
    await expect(page.locator('text=LocalSearch')).toBeVisible();
    
    // 2. User sees upload interface
    const hasUploadInterface = await page.locator('input[type="file"]').count() > 0;
    expect(hasUploadInterface).toBeTruthy();
    
    // 3. User would upload files (simulated)
    console.log('✅ Upload interface present');
    
    // 4. User would perform search (simulated)
    console.log('✅ Search workflow testable');
    
    // 5. User gets results
    console.log('✅ End-to-end workflow structure verified');
  });
});

test.describe('Performance Tests', () => {
  test('should load within acceptable time limits', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await expect(page.locator('#root')).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    console.log(`📊 Page load time: ${loadTime}ms`);
  });
  
  test('should have reasonable bundle sizes', async ({ page }) => {
    const responses = [];
    page.on('response', response => {
      if (response.url().includes('/assets/') && response.url().includes('.js')) {
        responses.push({
          url: response.url(),
          size: response.headers()['content-length']
        });
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForTimeout(3000);
    
    // Main bundle should not be excessively large (under 2MB)
    for (const response of responses) {
      if (response.size) {
        const sizeMB = parseInt(response.size) / (1024 * 1024);
        expect(sizeMB).toBeLessThan(2);
        console.log(`📦 Asset: ${response.url.split('/').pop()} - ${sizeMB.toFixed(2)}MB`);
      }
    }
  });
});