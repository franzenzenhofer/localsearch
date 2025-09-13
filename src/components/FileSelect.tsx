import { Box, Typography } from "@mui/material";
import { FileSelectButton } from "./FileSelectButton";

interface FileSelectProps {
  onUpload: (files: File[]) => void;
}

export function FileSelect({ onUpload }: FileSelectProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <FileSelectButton onUpload={onUpload} />

      <Typography variant="body2" color="text.secondary" textAlign="center">
        Choose ANY files - we support 100+ formats including Excel, PowerPoint,
        code files, archives, and more!
      </Typography>
    </Box>
  );
}
