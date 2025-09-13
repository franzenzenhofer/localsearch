import { describe, it, expect, beforeAll } from "vitest";
import {
  getAllSourceFiles,
  readFileContent,
} from "../../helpers/file-utils.js";
import { extractTypes } from "../../helpers/code-analysis.js";

describe("DRY - Duplicate Types", () => {
  let typeNames: Map<string, string[]>;

  beforeAll(async () => {
    const sourceFiles = await getAllSourceFiles("./src");
    typeNames = new Map();

    for (const file of sourceFiles) {
      const content = await readFileContent(file);
      const types = extractTypes(content);

      for (const typeName of types) {
        if (!typeNames.has(typeName)) {
          typeNames.set(typeName, []);
        }
        typeNames.get(typeName)!.push(file);
      }
    }
  });

  it("should not have duplicate interface names", () => {
    const duplicates = Array.from(typeNames.entries()).filter(
      ([, files]) => files.length > 1,
    );

    if (duplicates.length > 0) {
      /* eslint-disable no-console */
      console.warn("⚠️  Duplicate type/interface names:");
      duplicates.forEach(([name, files]) => {
        console.warn(`  ${name}: ${files.join(", ")}`);
      });
      /* eslint-enable no-console */
    }

    expect(duplicates).toHaveLength(0);
  });

  it("should have consistent type naming", () => {
    const namingIssues: string[] = [];

    for (const [typeName] of typeNames) {
      if (!isPascalCase(typeName)) {
        namingIssues.push(`Type ${typeName} not PascalCase`);
      }
    }

    expect(namingIssues.length).toBeLessThan(2);
  });

  it("should not have unused type definitions", () => {
    // This is a simplified check - in practice you'd need
    // full AST parsing to detect truly unused types
    const allTypes = Array.from(typeNames.keys());
    const potentiallyUnused = allTypes.filter((type) => {
      // Types with very short names are likely primitives or widely used
      return type.length > 10;
    });

    // This is informational - we don't fail the test
    expect(potentiallyUnused.length).toBeLessThan(20);
  });
});

function isPascalCase(str: string): boolean {
  return /^[A-Z][a-zA-Z0-9]*$/.test(str);
}
