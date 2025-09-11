import { Box, Typography, Paper, CircularProgress, List, Divider } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import type { SearchResult } from '../core/types.js'
import { SearchResultItem } from './SearchResultItem'

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
}

function LoadingState() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
      <CircularProgress size={40} />
      <Typography variant="body1" sx={{ ml: 2 }} color="text.secondary">
        Searching...
      </Typography>
    </Box>
  )
}

function EmptyState() {
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

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return <LoadingState />
  }

  if (results.length === 0) {
    return <EmptyState />
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Found {results.length} result{results.length !== 1 ? 's' : ''}
      </Typography>
      
      <List>
        {results.map((result, index) => (
          <Box key={result.metadata.id}>
            <SearchResultItem result={result} />
            {index < results.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Paper>
  )
}

