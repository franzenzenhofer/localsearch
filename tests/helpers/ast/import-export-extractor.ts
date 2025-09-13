export function extractImports(content: string): string[] {
  const imports: string[] = [];
  const importMatches = content.match(/import\s+[^;]+/g);

  if (!importMatches) return imports;

  for (const imp of importMatches) {
    const namedImports =
      imp
        .match(/{([^}]+)}/)?.[1]
        .split(",")
        .map((name) => name.trim().replace(/\s+as\s+\w+$/, "")) || [];
    imports.push(...namedImports);

    const defaultImport = imp.match(/import\s+(\w+)/)?.[1];
    if (defaultImport && !imp.includes("{")) {
      imports.push(defaultImport);
    }
  }

  return imports;
}

export function extractExports(content: string): string[] {
  const exports: string[] = [];

  // Named exports
  const namedExports = content.match(/export\s+{([^}]+)}/g);
  if (namedExports) {
    for (const exp of namedExports) {
      const names =
        exp
          .match(/{([^}]+)}/)?.[1]
          .split(",")
          .map((name) => name.trim()) || [];
      exports.push(...names);
    }
  }

  // Function exports
  const funcExports = content.match(
    /export\s+(function|class|const|let|var)\s+(\w+)/g,
  );
  if (funcExports) {
    for (const exp of funcExports) {
      const name = exp.match(/\s+(\w+)$/)?.[1];
      if (name) exports.push(name);
    }
  }

  if (content.includes("export default")) exports.push("default");
  return exports;
}
