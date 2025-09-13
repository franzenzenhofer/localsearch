import { Box, Typography, Divider } from "@mui/material";
import { FolderUpload } from "./FolderUpload";
import { FileSelect } from "./FileSelect";

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  fileCount: number;
}

export function FileUpload({ onUpload, fileCount }: FileUploadProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <FolderUpload onUpload={onUpload} fileCount={fileCount} />

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Divider sx={{ flex: 1, borderColor: "#000000", borderWidth: 1 }} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#424242" }}>
          OR
        </Typography>
        <Divider sx={{ flex: 1, borderColor: "#000000", borderWidth: 1 }} />
      </Box>

      <FileSelect onUpload={onUpload} />
    </Box>
  );
}
