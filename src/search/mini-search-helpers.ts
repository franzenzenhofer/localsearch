import type { SearchSnippet } from "../core/types";

export function generateSnippets(
  text: string,
  searchTerm: string,
): SearchSnippet[] {
  const lowerText = text.toLowerCase();
  const lowerTerm = searchTerm.toLowerCase();
  const index = lowerText.indexOf(lowerTerm);

  if (index === -1) return [];

  const start = Math.max(0, index - 30);
  const end = Math.min(text.length, index + searchTerm.length + 30);
  const snippet = text.slice(start, end);

  return [
    {
      text: snippet,
      positions: [index],
      highlights: [
        {
          start: index - start,
          end: index - start + searchTerm.length,
        },
      ],
    },
  ];
}

export function createDefaultMetadata() {
  return {
    id: "",
    path: "",
    name: "",
    extension: "",
    size: 0,
    lastModified: 0,
    type: "unknown" as any,
    hash: "",
  };
}
