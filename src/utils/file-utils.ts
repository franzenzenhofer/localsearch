export function createFileMetadata(file: File, hash?: string) {
  const extension = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase() || ""
    : "";
  const path = (file as any).webkitRelativePath || file.name;

  // Map extensions to standardized types
  const typeFromExtension = getTypeFromExtension(extension);

  return {
    id: crypto.randomUUID(),
    name: file.name,
    path,
    size: file.size,
    type: typeFromExtension || "unknown",
    lastModified: file.lastModified || Date.now(),
    extension,
    hash: hash || "",
  };
}

function getTypeFromExtension(ext: string): string | null {
  const typeMap: Record<string, string> = {
    pdf: "pdf",
    txt: "txt",
    md: "md",
    csv: "csv",
    html: "html",
    htm: "html",
    docx: "docx",
    js: "js",
    ts: "ts",
    json: "json",
  };
  return typeMap[ext] || null;
}

export async function generateFileHash(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (_error) {
    // Fallback to simple hash if crypto.subtle is not available
    const text = await file.text();
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(16).padStart(64, "0");
  }
}
