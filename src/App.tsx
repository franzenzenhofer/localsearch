import { Container, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { useSearch } from './hooks/useSearch'
import { SearchResults } from './components/SearchResults'
import { FileUpload } from './components/FileUpload'
import { AppHeader } from './components/AppHeader'
import { SearchBar } from './components/SearchBar'
import { DebugView } from './components/DebugView'
import { IndexManager } from './components/IndexManager'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FFB000', // Professional yellow
      contrastText: '#000000',
    },
    secondary: {
      main: '#0066CC', // Professional blue
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
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
        <AppHeader />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <SearchBar 
              query={query}
              setQuery={setQuery}
              onSearch={performSearch}
              isSearching={isSearching}
              fileCount={fileCount}
            />
            <IndexManager onLoadIndex={() => {}} />
            <FileUpload onUpload={handleFileUpload} fileCount={fileCount} />
            <SearchResults results={results} isLoading={isSearching} />
          </Box>
        </Container>
        <DebugView />
      </Box>
    </ThemeProvider>
  )
}

export default App