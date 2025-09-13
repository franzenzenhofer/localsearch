export function extractTypes(content: string): string[] {
  const types: string[] = [];
  const regex = /(?:interface\s+(\w+)|type\s+(\w+))/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const typeName = match[1] || match[2];
    if (typeName) types.push(typeName);
  }

  return types;
}
