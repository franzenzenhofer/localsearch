import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  GetApp as ExportIcon,
} from "@mui/icons-material";
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
  return (
    <List dense>
      {indexes.map((index) => (
        <ListItem
          key={index.id}
          onClick={() => onLoadIndex(index)}
          sx={{
            cursor: "pointer",
            bgcolor: "#FFFFFF",
            color: "#000000", // EXPLICIT BLACK TEXT
            border: "3px solid #000000",
            borderRadius: 0, // CONSISTENT SHARP CORNERS
            mb: 1,
            "&:nth-of-type(odd)": { bgcolor: "#F5F5F5", color: "#000000" }, // BLACK TEXT ON ALTERNATING ROWS
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
      ))}
    </List>
  );
}
