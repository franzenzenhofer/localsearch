import { describe, it, expect, beforeAll } from "vitest";
import {
  getAllSourceFiles,
  readFileContent,
} from "../../helpers/file-utils.js";
import { extractFunctions } from "../../helpers/code-analysis.js";

describe("DRY - Duplicate Functions", () => {
  let functionNames: Map<string, string[]>;

  beforeAll(async () => {
    const sourceFiles = await getAllSourceFiles("./src");
    functionNames = new Map();

    for (const file of sourceFiles) {
      const content = await readFileContent(file);
      const functions = extractFunctions(content);

      for (const funcName of functions) {
        if (!functionNames.has(funcName)) {
          functionNames.set(funcName, []);
        }
        functionNames.get(funcName)!.push(file);
      }
    }
  });

  it("should not have duplicate function names across files", () => {
    const allowedDuplicates = ["constructor", "render", "init", "setup"];

    const duplicates = Array.from(functionNames.entries())
      .filter(([name, files]) => files.length > 1)
      .filter(([name]) => !allowedDuplicates.includes(name.toLowerCase()));

    if (duplicates.length > 0) {
      /* eslint-disable no-console */
      console.warn("⚠️  DRY violation - duplicate function names:");
      duplicates.forEach(([name, files]) => {
        console.warn(`  ${name}: ${files.join(", ")}`);
      });
      /* eslint-enable no-console */
    }

    expect(duplicates.length).toBeLessThan(3);
  });

  it("should flag functions with similar names", () => {
    const similarFunctions: Array<[string, string]> = [];
    const allFunctions = Array.from(functionNames.keys());

    for (let i = 0; i < allFunctions.length; i++) {
      for (let j = i + 1; j < allFunctions.length; j++) {
        const func1 = allFunctions[i];
        const func2 = allFunctions[j];

        if (areSimilar(func1, func2)) {
          similarFunctions.push([func1, func2]);
        }
      }
    }

    expect(similarFunctions.length).toBeLessThan(5);
  });
});

function areSimilar(str1: string, str2: string): boolean {
  if (str1.length < 4 || str2.length < 4) return false;

  const threshold = 0.8;
  const similarity = calculateSimilarity(str1, str2);
  return similarity > threshold;
}

function calculateSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const maxLen = Math.max(len1, len2);

  if (maxLen === 0) return 1;

  let matches = 0;
  for (let i = 0; i < Math.min(len1, len2); i++) {
    if (str1[i] === str2[i]) matches++;
  }

  return matches / maxLen;
}
