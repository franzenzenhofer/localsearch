import { Container, TextField, Button, Typography, Box, InputAdornment, Paper, AppBar, Toolbar, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { useSearch } from './hooks/useSearch'
import { SearchResults } from './components/SearchResults'
import { FileUpload } from './components/FileUpload'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
})

function App() {
  const { 
    query, 
    setQuery, 
    results, 
    isSearching, 
    fileCount,
    performSearch,
    handleFileUpload 
  } = useSearch()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              LocalSearch
            </Typography>
            <Typography variant="body2" color="inherit">
              Private, offline folder search
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  fullWidth
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && performSearch()}
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
                  onClick={performSearch}
                  disabled={!query.trim() || fileCount === 0}
                  variant="contained"
                  size="large"
                  sx={{ px: 4, minWidth: 120 }}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </Box>
            </Paper>

            <FileUpload onUpload={handleFileUpload} fileCount={fileCount} />
            
            <SearchResults results={results} isLoading={isSearching} />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App