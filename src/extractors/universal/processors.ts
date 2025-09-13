import { addFileMetadata } from "../core";
import {
  textExtensions,
  archiveExtensions,
  structuredExtensions,
} from "./extensions";

export function isTextFile(extension: string): boolean {
  return textExtensions.includes(extension);
}

export function isArchive(extension: string): boolean {
  return archiveExtensions.includes(extension);
}

export function isStructuredData(extension: string): boolean {
  return structuredExtensions.includes(extension);
}

export async function extractText(file: File): Promise<string> {
  const text = await file.text();
  return addFileMetadata(file, text);
}

export async function extractArchive(file: File): Promise<string> {
  return addFileMetadata(
    file,
    `Archive file (${file.type || "unknown type"}) - Content extraction not yet implemented. ` +
      `Archive contains compressed files and folders.`,
  );
}

export async function extractStructuredData(file: File): Promise<string> {
  const text = await file.text();

  try {
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "json") {
      JSON.parse(text); // Validate JSON
      return addFileMetadata(file, `JSON Data:\n${text}`);
    }

    return addFileMetadata(file, `Structured Data (${extension}):\n${text}`);
  } catch (error) {
    return addFileMetadata(file, `Structured Data (parse error):\n${text}`);
  }
}
