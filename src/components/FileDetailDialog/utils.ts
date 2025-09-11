import { Image as ImageIcon, Description as FileIcon } from '@mui/icons-material'

export interface FileDetails {
  id: string
  filename: string
  path: string
  size: number
  type: string
  lastModified: number
  content?: string
  metadata?: any
}

export const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return ImageIcon
  return FileIcon
}

export const isImageFile = (filename: string, type: string) => {
  return type.includes('image') || 
    ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'].some(ext => 
      filename.toLowerCase().endsWith(ext)
    )
}