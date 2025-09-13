import { Box } from "@mui/material";
import { useRef, useEffect } from "react";
import { SearchBar } from "./SearchBar";
import { WelcomeMessage } from "./WelcomeMessage";
import { FileUpload } from "./FileUpload";
import { IndexManager } from "./IndexManager";
import { SearchResults } from "./SearchResults";
import { CompleteDebugView } from "./CompleteDebugView";
import type { SearchResult } from "../core/types.js";

interface MainContentProps {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  fileCount: number;
  performSearch: () => void;
  handleFileUpload: (files: File[]) => void;
}

export function MainContent({
  query,
  setQuery,
  results,
  isSearching,
  fileCount,
  performSearch,
  handleFileUpload,
}: MainContentProps) {
  const searchResultsRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to results when search completes
  useEffect(() => {
    if (results.length > 0 && searchResultsRef.current) {
      searchResultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [results.length]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={performSearch}
          isSearching={isSearching}
          fileCount={fileCount}
        />
        <WelcomeMessage
          show={results.length === 0 && !isSearching && fileCount === 0}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <FileUpload onUpload={handleFileUpload} fileCount={fileCount} />
        <IndexManager onLoadIndex={() => {}} fileCount={fileCount} />
      </Box>

      {(results.length > 0 || isSearching) && (
        <Box ref={searchResultsRef}>
          <SearchResults results={results} isLoading={isSearching} />
        </Box>
      )}

      {fileCount > 0 && results.length === 0 && !isSearching && (
        <Box
          sx={{
            textAlign: "center",
            p: 3,
            backgroundColor: "#FFD700",
            color: "#000000",
            borderRadius: 0, // CONSISTENT SHARP CORNERS
            fontWeight: "bold",
            border: "3px solid #000000",
          }}
        >
          FILES INDEXED! Now enter a search term above and click "Search" to
          find content!
        </Box>
      )}

      <CompleteDebugView />
    </Box>
  );
}
