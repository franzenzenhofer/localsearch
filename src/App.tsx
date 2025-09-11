import { Container, Box, CssBaseline, ThemeProvider, Typography } from '@mui/material'
import { useSearch } from './hooks/useSearch'
import { SearchResults } from './components/SearchResults'
import { FileUpload } from './components/FileUpload'
import { AppHeader } from './components/AppHeader'
import { SearchBar } from './components/SearchBar'
import { DebugView } from './components/DebugView'
import { IndexManager } from './components/IndexManager'
import { superheroTheme } from './theme/superhero'

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
    <ThemeProvider theme={superheroTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default' }}>
        <AppHeader />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* PRIMARY ACTION: Search Interface */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <SearchBar 
                query={query}
                setQuery={setQuery}
                onSearch={performSearch}
                isSearching={isSearching}
                fileCount={fileCount}
              />
              {results.length === 0 && !isSearching && fileCount === 0 && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h5" sx={{ color: '#1565C0', fontWeight: 600, mb: 2 }}>
                    🦸 Welcome to LocalSearch!
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                    Upload folders to get started with private, superhero-fast file searching
                  </Typography>
                </Box>
              )}
            </Box>

            {/* SECONDARY ACTIONS: File Management */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FileUpload onUpload={handleFileUpload} fileCount={fileCount} />
              <IndexManager onLoadIndex={() => {}} />
            </Box>

            {/* RESULTS: Search Output */}
            {(results.length > 0 || isSearching) && (
              <SearchResults results={results} isLoading={isSearching} />
            )}
          </Box>
        </Container>
        <DebugView />
      </Box>
    </ThemeProvider>
  )
}

export default App