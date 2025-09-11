import { Paper, Typography } from '@mui/material'
import type { SearchResult } from '../core/types.js'

interface ContentSnippetsProps {
  result: SearchResult
}

export function ContentSnippets({ result }: ContentSnippetsProps) {
  if (result.snippets.length === 0) return null

  return (
    <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
      <Typography variant="subtitle2" gutterBottom>
        Content matches:
      </Typography>
      {result.snippets.slice(0, 2).map((snippet, idx) => (
        <Typography key={idx} variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {snippet.text}
        </Typography>
      ))}
    </Paper>
  )
}