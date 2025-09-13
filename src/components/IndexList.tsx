import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
} from "@mui/material";
import { COLORS } from "../constants/colors";
import {
  Delete as DeleteIcon,
  GetApp as ExportIcon,
  Visibility as InspectIcon,
} from "@mui/icons-material";
import { IndexInspector } from "./IndexInspector";
import { useState } from "react";
import type { StoredIndex } from "../core/StorageManager";

interface IndexListProps {
  indexes: StoredIndex[];
  onLoadIndex: (index: StoredIndex) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
}

export function IndexList({
  indexes,
  onLoadIndex,
  onDelete,
  onExport,
}: IndexListProps) {
  const [inspectingIndex, setInspectingIndex] = useState<StoredIndex | null>(null);
  
  return (
    <Box>
      <List dense>
        {indexes.map((index) => (
          <Box key={index.id}>
            <ListItem
              onClick={() => onLoadIndex(index)}
              sx={{
                cursor: "pointer",
                bgcolor: COLORS.WHITE,
                color: COLORS.BLACK, // EXPLICIT BLACK TEXT
                border: `3px solid ${COLORS.BLACK}`,
                borderRadius: 0, // CONSISTENT SHARP CORNERS
                mb: 1,
                "&:nth-of-type(odd)": { bgcolor: COLORS.WHITE, color: COLORS.BLACK }, // BLACK TEXT ON ALTERNATING ROWS
              }}
            >
              <ListItemText
                primary={index.name}
                secondary={`${index.fileCount} files • ${new Date(index.created).toLocaleDateString()}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setInspectingIndex(inspectingIndex?.id === index.id ? null : index);
                  }}
                  size="small"
                  color="primary"
                >
                  <InspectIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onExport(index.id);
                  }}
                  size="small"
                >
                  <ExportIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(index.id);
                  }}
                  size="small"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            
            <IndexInspector 
              index={index} 
              show={inspectingIndex?.id === index.id} 
            />
          </Box>
        ))}
      </List>
    </Box>
  );
}
