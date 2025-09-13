import { Container, Box, CssBaseline, ThemeProvider } from "@mui/material";
import { useSearch } from "./hooks/useSearch";
import { AppHeader } from "./components/AppHeader";
import { MainContent } from "./components/MainContent";
import { ConnectivityStatus } from "./components/ConnectivityStatus";
import { RealTimeStatus } from "./components/RealTimeStatus";
import { superheroTheme } from "./theme/superhero";
import { useAppInit } from "./components/AppInit";

function App() {
  useAppInit();

  const {
    query,
    setQuery,
    results,
    isSearching,
    fileCount,
    processingStatus,
    showStatus,
    performSearch,
    handleFileUpload,
  } = useSearch();

  return (
    <ThemeProvider theme={superheroTheme}>
      <CssBaseline />
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          width: "100vw",
          maxWidth: "100vw",
        }}
      >
        <AppHeader />
        <Container
          maxWidth={false}
          sx={{
            py: 2,
            px: 2,
            width: "100%",
            maxWidth: "100%",
            flex: 1,
            overflow: "auto",
            boxSizing: "border-box",
          }}
        >
          <MainContent
            query={query}
            setQuery={setQuery}
            results={results}
            isSearching={isSearching}
            fileCount={fileCount}
            performSearch={performSearch}
            handleFileUpload={handleFileUpload}
          />
          <RealTimeStatus show={showStatus} status={processingStatus} />
        </Container>
        <ConnectivityStatus />
      </Box>
    </ThemeProvider>
  );
}

export default App;
