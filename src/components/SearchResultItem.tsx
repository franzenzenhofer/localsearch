import { ListItem, Avatar, ListItemAvatar, ListItemText, Box, Typography, Chip } from '@mui/material'
import { Description as DocumentIcon } from '@mui/icons-material'
import type { SearchResult } from '../core/types.js'
import { SearchMetadata } from './SearchMetadata'
import { ContentSnippets } from './ContentSnippets'

interface SearchResultItemProps {
  result: SearchResult
}

export function SearchResultItem({ result }: SearchResultItemProps) {
  return (
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
            <SearchMetadata metadata={result.metadata} />
            <ContentSnippets result={result} />
          </Box>
        }
      />
    </ListItem>
  )
}