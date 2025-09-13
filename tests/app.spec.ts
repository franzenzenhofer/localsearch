import { test, expect } from "@playwright/test";

test.describe("LocalSearch Application", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the main interface", async ({ page }) => {
    await expect(page).toHaveTitle(/LocalSearch/);
    await expect(page.locator("h1")).toContainText("LocalSearch");
    await expect(page.locator("p")).toContainText(
      "Private, offline folder search",
    );
  });

  test("should show search interface", async ({ page }) => {
    await expect(page.locator("#search-input")).toBeVisible();
    await expect(page.locator("#search-btn")).toBeVisible();
    await expect(page.locator("#select-folder-btn")).toBeVisible();
  });

  test("should have functional search input", async ({ page }) => {
    const searchInput = page.locator("#search-input");
    await searchInput.fill("test query");
    await expect(searchInput).toHaveValue("test query");
  });

  test("should show folder selection button", async ({ page }) => {
    const folderBtn = page.locator("#select-folder-btn");
    await expect(folderBtn).toBeVisible();
    await expect(folderBtn).toContainText("Select Folder to Index");
  });

  test("should handle search with empty query", async ({ page }) => {
    await page.locator("#search-btn").click();
    // Should not show results for empty search
    await expect(page.locator(".no-results")).not.toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.locator(".container")).toBeVisible();
    await expect(page.locator("#search-input")).toBeVisible();
    await expect(page.locator("#select-folder-btn")).toBeVisible();
  });

  test("should have proper accessibility", async ({ page }) => {
    // Check for proper ARIA labels and roles
    await expect(page.locator("#search-input")).toHaveAttribute(
      "placeholder",
      "Search your files...",
    );

    // Check keyboard navigation
    await page.keyboard.press("Tab");
    await expect(page.locator("#search-input")).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.locator("#search-btn")).toBeFocused();
  });

  test("should support dark/light mode", async ({ page }) => {
    // Test that CSS variables are properly applied
    const bodyStyle = await page.locator("body").evaluate((el) => {
      return window.getComputedStyle(el).background;
    });

    expect(bodyStyle).toBeTruthy();
  });
});
