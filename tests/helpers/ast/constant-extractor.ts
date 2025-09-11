export function extractConstants(content: string): Array<{name: string, value: string}> {
  const constants: Array<{name: string, value: string}> = [];
  const regex = /const\s+(\w+)\s*=\s*(['"`])(.*?)\2/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    constants.push({ name: match[1], value: match[3] });
  }
  
  return constants;
}