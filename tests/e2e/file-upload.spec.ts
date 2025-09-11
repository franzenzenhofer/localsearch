import { test, expect } from '@playwright/test';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

test.describe('File Upload - E2E', () => {
  const testDir = join(process.cwd(), 'temp-e2e-files');
  
  test.beforeAll(async () => {
    await mkdir(testDir, { recursive: true });
    
    await writeFile(join(testDir, 'test.txt'), 
      'This is a test document with artificial intelligence content.');
    
    await writeFile(join(testDir, 'notes.md'), 
      '# Notes\n\n## AI Research\n- Machine learning\n- Deep learning');
    
    await writeFile(join(testDir, 'data.csv'), 
      'name,type\nLocalSearch,SearchEngine\nPDF.js,Extractor');
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should upload text files successfully', async ({ page }) => {
    const fileInput = page.locator('#file-input');
    
    await fileInput.setInputFiles([join(testDir, 'test.txt')]);
    
    // Wait for indexing indicator
    await expect(page.locator('.stats'))
      .toContainText('files indexed', { timeout: 10000 });
  });

  test('should upload markdown files', async ({ page }) => {
    const fileInput = page.locator('#file-input');
    
    await fileInput.setInputFiles([join(testDir, 'notes.md')]);
    
    await expect(page.locator('.stats'))
      .toContainText('files indexed', { timeout: 10000 });
  });

  test('should upload CSV files', async ({ page }) => {
    const fileInput = page.locator('#file-input');
    
    await fileInput.setInputFiles([join(testDir, 'data.csv')]);
    
    await expect(page.locator('.stats'))
      .toContainText('files indexed', { timeout: 10000 });
  });

  test('should handle multiple file upload', async ({ page }) => {
    const fileInput = page.locator('#file-input');
    
    await fileInput.setInputFiles([
      join(testDir, 'test.txt'),
      join(testDir, 'notes.md'),
      join(testDir, 'data.csv')
    ]);
    
    await expect(page.locator('.stats'))
      .toContainText('files indexed', { timeout: 10000 });
  });
});