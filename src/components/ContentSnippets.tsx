import { Paper, Typography } from "@mui/material";
import type { SearchResult } from "../core/types.js";

interface ContentSnippetsProps {
  result: SearchResult;
}

export function ContentSnippets({ result }: ContentSnippetsProps) {
  if (result.snippets.length === 0) return null;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1, sm: 2 }, // Responsive padding
        mt: 2,
        bgcolor: "grey.50",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflow: "hidden", // Prevent content overflow
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Content matches:
      </Typography>
      {result.snippets.slice(0, 2).map((snippet, idx) => (
        <Typography
          key={idx}
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            // CRITICAL: Prevent horizontal overflow from long snippet text
            wordBreak: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          {snippet.text}
        </Typography>
      ))}
    </Paper>
  );
}
