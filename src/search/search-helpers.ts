export function generateSnippets(text: string, queryText: string): Array<{
  text: string;
  positions: number[];
  highlights: Array<{start: number, end: number}>;
}> {
  const words = queryText.toLowerCase().split(/\s+/);
  const snippets = [];

  for (const word of words) {
    const index = text.toLowerCase().indexOf(word);
    if (index !== -1) {
      const start = Math.max(0, index - 50);
      const end = Math.min(text.length, index + word.length + 50);
      
      snippets.push({
        text: text.slice(start, end),
        positions: [index],
        highlights: [{ start: index - start, end: index - start + word.length }],
      });
    }
  }

  return snippets.slice(0, 3);
}

export function createSearchOptions() {
  return {
    boost: { text: 2 },
    fuzzy: 0.2,
    prefix: true,
  };
}

export function formatSearchDocument(doc: any) {
  return {
    id: doc.id,
    fileId: doc.fileId,
    text: doc.text,
  };
}