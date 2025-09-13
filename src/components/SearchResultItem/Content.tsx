import { Box, Typography } from "@mui/material";
import { SearchMetadata } from "../SearchMetadata";
import { ContentSnippets } from "../ContentSnippets";

interface ContentProps {
  path: string;
  metadata: any;
  result: any;
}

export function Content({ path, metadata, result }: ContentProps) {
  return (
    <Box>
      <Typography
        variant="body2"
        color="text.secondary"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: "#1565C0",
          fontFamily: "monospace",
          fontSize: "0.85rem",
          // CRITICAL: Prevent horizontal overflow from long paths
          wordBreak: "break-all",
          overflowWrap: "break-word",
          whiteSpace: "pre-wrap",
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        Path: {path}
      </Typography>
      <SearchMetadata metadata={metadata} />
      <ContentSnippets result={result} />
    </Box>
  );
}
