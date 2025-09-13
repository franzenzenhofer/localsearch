import { useState } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { StorageManager, type StoredIndex } from "../core/StorageManager";
import { IndexList } from "./IndexList";
import { IndexImport } from "./IndexImport";

interface IndexManagerProps {
  onLoadIndex: (index: StoredIndex) => void;
  fileCount?: number;
}

export function IndexManager({
  onLoadIndex,
  fileCount = 0,
}: IndexManagerProps) {
  const [indexes] = useState<StoredIndex[]>(() => StorageManager.getIndexes());

  const handleDelete = (id: string) => {
    StorageManager.deleteIndex(id);
    window.location.reload();
  };

  const handleExport = (id: string) => {
    const data = StorageManager.exportIndex(id);
    if (data) {
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `localsearch-index-${id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (indexes.length === 0 && fileCount === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          No Saved Indexes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload files to create your first search index
        </Typography>
      </Paper>
    );
  }

  if (indexes.length === 0 && fileCount > 0) {
    return (
      <Paper
        sx={{
          p: 3,
          textAlign: "center",
          backgroundColor: "#E8F5E8",
          border: "2px solid #4CAF50",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: "#2E7D2E" }}>
          Current Session: {fileCount} File{fileCount !== 1 ? "s" : ""} Indexed
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Files are ready for search! Use the search bar above to find content.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Saved Indexes</Typography>
        <IndexImport onLoadIndex={onLoadIndex} />
      </Box>

      <IndexList
        indexes={indexes}
        onLoadIndex={onLoadIndex}
        onDelete={handleDelete}
        onExport={handleExport}
      />
    </Paper>
  );
}
