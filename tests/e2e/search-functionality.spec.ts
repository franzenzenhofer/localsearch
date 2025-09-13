import { test, expect } from "@playwright/test";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

test.describe("Search Functionality - E2E", () => {
  const testDir = join(process.cwd(), "temp-search-files");

  test.beforeAll(async () => {
    await mkdir(testDir, { recursive: true });

    await writeFile(
      join(testDir, "ai-doc.txt"),
      "Machine learning and artificial intelligence algorithms for data processing.",
    );

    await writeFile(
      join(testDir, "tech-notes.md"),
      "# Technology\n\nTypeScript is a typed superset of JavaScript.",
    );
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    // Upload test files
    const fileInput = page.locator("#file-input");
    await fileInput.setInputFiles([
      join(testDir, "ai-doc.txt"),
      join(testDir, "tech-notes.md"),
    ]);

    await expect(page.locator(".stats")).toContainText("files indexed", {
      timeout: 10000,
    });
  });

  test("should find results for AI query", async ({ page }) => {
    const searchInput = page.locator("#search-input");

    await searchInput.fill("artificial intelligence");
    await searchInput.press("Enter");

    await expect(page.locator(".search-results")).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator(".result-item")).toContainText("ai-doc.txt");
  });

  test("should find results for technology query", async ({ page }) => {
    const searchInput = page.locator("#search-input");

    await searchInput.fill("TypeScript");
    await searchInput.press("Enter");

    await expect(page.locator(".result-item")).toContainText("tech-notes.md", {
      timeout: 5000,
    });
  });

  test("should show no results for nonexistent terms", async ({ page }) => {
    const searchInput = page.locator("#search-input");

    await searchInput.fill("nonexistentterm12345");
    await searchInput.press("Enter");

    await expect(page.locator(".no-results")).toBeVisible({ timeout: 5000 });
  });

  test("should perform fast searches", async ({ page }) => {
    const searchInput = page.locator("#search-input");

    const startTime = Date.now();
    await searchInput.fill("machine");
    await searchInput.press("Enter");

    await page.locator(".search-results").waitFor({ timeout: 1000 });
    const searchTime = Date.now() - startTime;

    expect(searchTime).toBeLessThan(500);
  });
});
