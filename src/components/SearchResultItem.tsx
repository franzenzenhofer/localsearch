import { useState } from "react";
import { ListItem, Avatar, ListItemAvatar, Box } from "@mui/material";
import {
  Description as DocumentIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import type { SearchResult } from "../core/types.js";
import { FileDetailPanel } from "./FileDetailPanel";
import { Header } from "./SearchResultItem/Header";
import { Content } from "./SearchResultItem/Content";
import { isImageFile, createFileDetails } from "./SearchResultItem/utils";

interface SearchResultItemProps {
  result: SearchResult;
}

export function SearchResultItem({ result }: SearchResultItemProps) {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const isImage = isImageFile(result.metadata.name, result.metadata.type);
  const fileDetails = createFileDetails(result);

  return (
    <Box sx={{ width: "100%" }}>
      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            {isImage ? <ImageIcon /> : <DocumentIcon />}
          </Avatar>
        </ListItemAvatar>
        <Box sx={{ flexGrow: 1 }}>
          <Header
            filename={result.metadata.name}
            score={result.score}
            onDetailClick={() => setDetailsExpanded(!detailsExpanded)}
          />
          <Content
            path={result.metadata.path}
            metadata={result.metadata}
            result={result}
          />
        </Box>
      </ListItem>

      <FileDetailPanel
        expanded={detailsExpanded}
        onToggle={() => setDetailsExpanded(false)}
        fileDetails={fileDetails}
      />
    </Box>
  );
}
