import { useState } from 'react'
import { Box, Typography, Button, Card, CardContent } from '@mui/material'

interface FileDetailContentProps {
  content: string
}

export function FileDetailContent({ content }: FileDetailContentProps) {
  const [showFullContent, setShowFullContent] = useState(false)
  
  if (!content) return null

  return (
    <Card sx={{ border: '2px solid #000000', borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#000000' }}>
            Content Preview
          </Typography>
          <Button 
            onClick={() => setShowFullContent(!showFullContent)}
            size="small"
            sx={{ color: '#1565C0', fontWeight: 600 }}
          >
            {showFullContent ? 'Show Less' : 'Show More'}
          </Button>
        </Box>
        <Box sx={{ 
          bgcolor: '#FFFFFF', 
          border: '1px solid #E0E0E0',
          borderRadius: 1,
          p: 2,
          maxHeight: showFullContent ? 'none' : 200,
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          whiteSpace: 'pre-wrap'
        }}>
          {showFullContent ? content : `${content.slice(0, 500)}${content.length > 500 ? '...' : ''}`}
        </Box>
      </CardContent>
    </Card>
  )
}