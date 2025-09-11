import { Box, Typography, Chip, Card, CardContent } from '@mui/material'

interface BasicFileInfoProps {
  filename: string
  size: number
  type: string
  lastModified: number
}

export function BasicFileInfo({ filename, size, type, lastModified }: BasicFileInfoProps) {
  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB']
    let fileSize = bytes
    let unitIndex = 0
    
    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024
      unitIndex++
    }
    
    return `${fileSize.toFixed(1)} ${units[unitIndex]}`
  }

  return (
    <Card sx={{ border: '2px solid #FFD700', borderRadius: 2, height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#000000', mb: 2 }}>
          Basic Information
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Name:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{filename}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Size:</Typography>
            <Typography variant="body2">{formatFileSize(size)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Type:</Typography>
            <Chip 
              label={type || 'unknown'} 
              size="small" 
              sx={{ 
                bgcolor: '#FFD700', 
                color: '#000000', 
                fontWeight: 600,
                border: '1px solid #000000'
              }} 
            />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Modified:</Typography>
            <Typography variant="body2">
              {new Date(lastModified).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}