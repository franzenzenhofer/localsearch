import { test, expect } from "@playwright/test";

test.describe("Basic Interface - E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load main interface correctly", async ({ page }) => {
    await expect(page).toHaveTitle(/LocalSearch/);
    await expect(page.locator("h1")).toContainText("LocalSearch");
    await expect(page.locator("p")).toContainText(
      "Private, offline folder search",
    );
  });

  test("should display search interface elements", async ({ page }) => {
    await expect(page.locator("#search-input")).toBeVisible();
    await expect(page.locator("#search-btn")).toBeVisible();
    await expect(page.locator("#select-folder-btn")).toBeVisible();
  });

  test("should have functional search input", async ({ page }) => {
    const searchInput = page.locator("#search-input");

    await searchInput.fill("test query");
    await expect(searchInput).toHaveValue("test query");

    await searchInput.clear();
    await expect(searchInput).toHaveValue("");
  });

  test("should show folder selection button", async ({ page }) => {
    const folderBtn = page.locator("#select-folder-btn");

    await expect(folderBtn).toBeVisible();
    await expect(folderBtn).toContainText("Select Folder to Index");
  });

  test("should handle empty search gracefully", async ({ page }) => {
    await page.locator("#search-btn").click();

    // Should not crash or show error results
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator(".no-results")).not.toBeVisible();
  });

  test("should maintain interface state", async ({ page }) => {
    const searchInput = page.locator("#search-input");

    await searchInput.fill("persistent query");

    // Click somewhere else
    await page.locator("h1").click();

    // Input should maintain its value
    await expect(searchInput).toHaveValue("persistent query");
  });
});
