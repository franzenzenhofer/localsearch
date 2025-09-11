import { Typography, Card, CardContent } from '@mui/material'
import { Folder as FolderIcon } from '@mui/icons-material'

interface FileLocationCardProps {
  path: string
}

export function FileLocationCard({ path }: FileLocationCardProps) {
  return (
    <Card sx={{ border: '2px solid #1565C0', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#1565C0', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FolderIcon />
          File Location
        </Typography>
        <Typography variant="body1" sx={{ 
          wordBreak: 'break-all', 
          bgcolor: '#E3F2FD', 
          p: 2, 
          borderRadius: 1,
          fontFamily: 'monospace',
          fontSize: '0.9rem'
        }}>
          {path}
        </Typography>
      </CardContent>
    </Card>
  )
}