import { promises as fs } from "fs";
import { join } from "path";

export async function getAllSourceFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        const subFiles = await getAllSourceFiles(fullPath);
        files.push(...subFiles);
      } else if (
        entry.name.match(/\.(ts|js)$/) &&
        !entry.name.includes(".test.")
      ) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist
  }

  return files;
}

export async function readFileContent(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return "";
  }
}

export async function getFileSize(filePath: string): Promise<number> {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

export function getLineCount(content: string): number {
  return content.split("\n").length;
}

export function getFileExtension(filePath: string): string {
  return filePath.split(".").pop() || "";
}

export async function createTempFile(
  name: string,
  content: string,
): Promise<string> {
  const tempPath = join("./test-temp", name);
  await fs.mkdir("./test-temp", { recursive: true });
  await fs.writeFile(tempPath, content);
  return tempPath;
}

export async function cleanupTempFiles(): Promise<void> {
  try {
    await fs.rmdir("./test-temp", { recursive: true });
  } catch {
    // Already clean
  }
}
