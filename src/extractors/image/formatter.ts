import { formatFileSize } from "./metadata";

export function formatImageContent(
  path: string,
  file: File,
  metadata: any,
  extractedText: string,
): string {
  return `
=== IMAGE FILE METADATA ===
Path: ${path}
Name: ${file.name}
Size: ${metadata.size || formatFileSize(file.size)}
Type: ${file.type || "image"}
Last Modified: ${metadata.lastModified || new Date(file.lastModified).toLocaleString()}
Dimensions: ${metadata.width && metadata.height ? `${metadata.width}x${metadata.height}` : "Unknown"}
EXIF Date: ${metadata.dateTime || metadata.exifDate || "Not available"}

=== EXTRACTED TEXT CONTENT ===
${extractedText}

=== SEARCHABLE KEYWORDS ===
image photo picture graphic visual ${file.name.split(".")[0]} ${file.type}
=== END IMAGE ===
`;
}
