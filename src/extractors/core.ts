import { BaseExtractor } from './base'

export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

export function addFileMetadata(file: File, content: string): string {
  const path = (file as any).webkitRelativePath || file.name
  return `
=== FILE METADATA ===
Path: ${path}
Name: ${file.name}
Size: ${formatFileSize(file.size)}
Type: ${file.type || 'unknown'}
Last Modified: ${new Date(file.lastModified).toLocaleString()}
=== CONTENT ===
${content}
=== END FILE ===
`
}