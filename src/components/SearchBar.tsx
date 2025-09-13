import { TextField, Button, Box, InputAdornment, Paper } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isSearching: boolean;
  fileCount: number;
}

export function SearchBar({
  query,
  setQuery,
  onSearch,
  isSearching,
  fileCount,
}: SearchBarProps) {
  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: { xs: 2, sm: 3 }, // Smaller padding on mobile
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box", // Ensure padding doesn't cause overflow
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: { xs: 1, sm: 2 }, // Smaller gap on mobile
          flexDirection: { xs: "column", sm: "row" }, // Stack vertically on mobile
          alignItems: "stretch", // Ensure full-width elements
        }}
      >
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
          sx={{
            flexGrow: 1,
            minWidth: 0, // Remove fixed min-width for mobile-first approach
            width: "100%", // Ensure full width utilization
          }}
        />
        <Button
          onClick={onSearch}
          disabled={!query.trim() || fileCount === 0}
          variant="contained"
          size="large"
          sx={{
            px: { xs: 2, sm: 4 }, // Responsive padding: smaller on mobile
            minWidth: 0, // Remove fixed min-width for fluid design
            flexShrink: 0, // Prevent button from shrinking too much
          }}
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </Box>
    </Paper>
  );
}
