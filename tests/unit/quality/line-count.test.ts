import { describe, it, expect, beforeAll } from 'vitest';
import { getAllSourceFiles, readFileContent, getLineCount } from '../../helpers/file-utils.js';

describe('Code Quality - Line Count Enforcement', () => {
  let fileLineCounts: Map<string, number>;
  
  beforeAll(async () => {
    const sourceFiles = await getAllSourceFiles('./src');
    const testFiles = await getAllSourceFiles('./tests');
    const extensionFiles = await getAllSourceFiles('./extensions');
    
    fileLineCounts = new Map();
    const allFiles = [...sourceFiles, ...testFiles, ...extensionFiles];
    
    for (const file of allFiles) {
      const content = await readFileContent(file);
      const lineCount = getLineCount(content);
      fileLineCounts.set(file, lineCount);
    }
  });

  it('should enforce 75-line limit on ALL files', () => {
    const violations: Array<{file: string, lines: number}> = [];
    const maxLines = 75;
    
    for (const [file, lines] of fileLineCounts) {
      if (lines > maxLines) {
        violations.push({ file, lines });
      }
    }
    
    if (violations.length > 0) {
      /* eslint-disable no-console */
      console.error('❌ HARDCORE LINT VIOLATION - Files over 75 lines:');
      violations.forEach(({ file, lines }) => {
        console.error(`  ${file}: ${lines} lines (${lines - maxLines} over limit)`);
      });
      /* eslint-enable no-console */
    }
    
    // HARDCORE - NO EXCEPTIONS!
    expect(violations).toHaveLength(0);
  });

  it('should encourage even smaller files', () => {
    const idealMax = 50;
    const largeFiles = Array.from(fileLineCounts.entries())
      .filter(([, lines]) => lines > idealMax)
      .length;
    
    const totalFiles = fileLineCounts.size;
    const smallFileRatio = ((totalFiles - largeFiles) / totalFiles) * 100;
    
    /* eslint-disable no-console */
    console.log(`📊 Modularity Metrics:`);
    console.log(`  Files under 50 lines: ${totalFiles - largeFiles}/${totalFiles} (${smallFileRatio.toFixed(1)}%)`);
    /* eslint-enable no-console */
    
    // Encourage high modularity
    expect(smallFileRatio).toBeGreaterThan(60);
  });

  it('should track average file size', () => {
    const allLineCounts = Array.from(fileLineCounts.values());
    const averageLines = allLineCounts.reduce((sum, lines) => sum + lines, 0) / allLineCounts.length;
    
    /* eslint-disable no-console */
    console.log(`📏 Average file size: ${averageLines.toFixed(1)} lines`);
    /* eslint-enable no-console */
    
    // Average should be reasonable for modular code
    expect(averageLines).toBeLessThan(40);
  });
});