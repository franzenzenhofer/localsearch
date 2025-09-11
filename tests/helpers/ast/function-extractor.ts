export function extractFunctions(content: string): string[] {
  const functions: string[] = [];
  const regex = /(?:function\s+(\w+)|(\w+)\s*\(.*?\)\s*{|(\w+)\s*:\s*\(.*?\)\s*=>|class\s+(\w+))/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const funcName = match[1] || match[2] || match[3] || match[4];
    if (funcName && funcName.length > 2) {
      functions.push(funcName);
    }
  }
  
  return functions;
}