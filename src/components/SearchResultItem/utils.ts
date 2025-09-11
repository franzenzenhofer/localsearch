export const isImageFile = (filename: string, type?: string) => {
  return type?.includes('image') || 
    ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'].some(ext => 
      filename?.toLowerCase().endsWith(ext)
    )
}

export const createFileDetails = (result: any) => ({
  id: result.metadata.id || crypto.randomUUID(),
  filename: result.metadata.name || 'unknown',
  path: result.metadata.path || 'unknown',
  size: result.metadata.size || 0,
  type: result.metadata.type || 'unknown',
  lastModified: result.metadata.lastModified || Date.now(),
  content: result.text,
  metadata: result.metadata
})