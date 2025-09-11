import { Box, Chip } from '@mui/material'
import { Schedule as CalendarIcon } from '@mui/icons-material'
import type { FileMetadata } from '../core/types.js'

interface SearchMetadataProps {
  metadata: FileMetadata
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function SearchMetadata({ metadata }: SearchMetadataProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
      <Chip 
        icon={<CalendarIcon sx={{ fontSize: 16 }} />}
        label={new Date(metadata.lastModified).toLocaleDateString()}
        size="small"
        variant="outlined"
      />
      <Chip 
        label={formatFileSize(metadata.size)}
        size="small"
        variant="outlined"
      />
      <Chip 
        label={metadata.type.toUpperCase()}
        size="small"
        variant="outlined"
        color="secondary"
      />
    </Box>
  )
}