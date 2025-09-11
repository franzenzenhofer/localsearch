import { Box, Typography, Paper, Chip, CircularProgress, List, ListItem, Avatar, ListItemAvatar, ListItemText, Divider } from '@mui/material'
import { Search as SearchIcon, Description as DocumentIcon, Schedule as CalendarIcon } from '@mui/icons-material'
import type { SearchResult } from '../core/types.js'

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ ml: 2 }} color="text.secondary">
          Searching...
        </Typography>
      </Box>
    )
  }

  if (results.length === 0) {
    return (
      <Paper sx={{ textAlign: 'center', py: 8, px: 4 }}>
        <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No results found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try uploading some documents or adjusting your search terms
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Found {results.length} result{results.length !== 1 ? 's' : ''}
      </Typography>
      
      <List>
        {results.map((result, index) => (
          <Box key={result.metadata.id}>
            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <DocumentIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle1" component="span" sx={{ flexGrow: 1 }}>
                      {result.metadata.name}
                    </Typography>
                    <Chip 
                      label={`${Math.round(result.score * 100)}%`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {result.metadata.path}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Chip 
                        icon={<CalendarIcon sx={{ fontSize: 16 }} />}
                        label={new Date(result.metadata.lastModified).toLocaleDateString()}
                        size="small"
                        variant="outlined"
                      />
                      <Chip 
                        label={formatFileSize(result.metadata.size)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip 
                        label={result.metadata.type.toUpperCase()}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    </Box>

                    {result.snippets.length > 0 && (
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
                    )}
                  </Box>
                }
              />
            </ListItem>
            {index < results.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Paper>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}