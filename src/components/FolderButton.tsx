import { Button } from "@mui/material";
import { FolderOpen as FolderIcon } from "@mui/icons-material";
import { processFolderSelection } from "./FolderProcessor";

interface FolderButtonProps {
  onUpload: (files: File[]) => void;
  isSupported: boolean;
}

export function FolderButton({ onUpload, isSupported }: FolderButtonProps) {
  const handleFolderSelect = () => {
    if (isSupported) {
      processFolderSelection({ onUpload });
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      variant="contained"
      size="large"
      startIcon={<FolderIcon />}
      onClick={handleFolderSelect}
      sx={{
        py: 3,
        px: 4,
        fontSize: "1.1rem",
        fontWeight: 700,
        bgcolor: "#000000",
        color: "#FFFFFF",
        border: "3px solid #000000",
        borderRadius: 0,
        "&:active": {
          bgcolor: "#FFFFFF",
          color: "#000000",
          border: "3px solid #000000",
        },
      }}
    >
      Select Whole Folder
    </Button>
  );
}
