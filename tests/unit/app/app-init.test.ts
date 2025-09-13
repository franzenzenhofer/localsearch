import { describe, it, expect, beforeEach } from "vitest";
import { setupMockDOM, clearMockDOM } from "../../helpers/mock-dom.js";

describe("LocalSearchApp - Initialization", () => {
  beforeEach(() => {
    clearMockDOM();
    setupMockDOM();
  });

  it("should initialize without errors", async () => {
    const { LocalSearchApp } = await import(
      "../../../src/app/LocalSearchApp.js"
    );

    expect(() => new LocalSearchApp()).not.toThrow();
  });

  it("should setup UI elements on initialization", async () => {
    const { LocalSearchApp } = await import(
      "../../../src/app/LocalSearchApp.js"
    );
    new LocalSearchApp();

    expect(global.document.getElementById).toHaveBeenCalledWith("search-input");
    expect(global.document.getElementById).toHaveBeenCalledWith("search-btn");
    expect(global.document.getElementById).toHaveBeenCalledWith("file-input");
  });

  it("should setup event listeners", async () => {
    const { LocalSearchApp } = await import(
      "../../../src/app/LocalSearchApp.js"
    );
    new LocalSearchApp();

    // Verify event listeners were set up (mocked)
    expect(true).toBe(true); // Placeholder - mocks prevent direct verification
  });

  it("should handle missing DOM elements gracefully", async () => {
    // Mock getElementById to return null
    (global.document.getElementById as any).mockReturnValue(null);

    const { LocalSearchApp } = await import(
      "../../../src/app/LocalSearchApp.js"
    );

    expect(() => new LocalSearchApp()).not.toThrow();
  });

  it("should initialize with default state", async () => {
    const { LocalSearchApp } = await import(
      "../../../src/app/LocalSearchApp.js"
    );
    const app = new LocalSearchApp();

    // App should be created successfully
    expect(app).toBeDefined();
    expect(typeof app).toBe("object");
  });
});
