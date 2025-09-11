import { Box, Typography } from '@mui/material'
import { SearchMetadata } from '../SearchMetadata'
import { ContentSnippets } from '../ContentSnippets'

interface ContentProps {
  path: string
  metadata: any
  result: any
}

export function Content({ path, metadata, result }: ContentProps) {
  return (
    <Box>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          color: '#1565C0',
          fontFamily: 'monospace',
          fontSize: '0.85rem'
        }}
      >
        📁 {path}
      </Typography>
      <SearchMetadata metadata={metadata} />
      <ContentSnippets result={result} />
    </Box>
  )
}