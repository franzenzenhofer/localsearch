import { TextField, Button, Box, InputAdornment, Paper } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'

interface SearchBarProps {
  query: string
  setQuery: (query: string) => void
  onSearch: () => void
  isSearching: boolean
  fileCount: number
}

export function SearchBar({ query, setQuery, onSearch, isSearching, fileCount }: SearchBarProps) {
  const handleKeyDown = (e: { key: string }) => {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search your files..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, minWidth: 300 }}
        />
        <Button
          onClick={onSearch}
          disabled={!query.trim() || fileCount === 0}
          variant="contained"
          size="large"
          sx={{ px: 4, minWidth: 120 }}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </Box>
    </Paper>
  )
}