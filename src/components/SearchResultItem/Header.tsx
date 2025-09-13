import { Box, Typography, Chip, IconButton } from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";

interface HeaderProps {
  filename: string;
  score: number;
  onDetailClick: () => void;
}

export function Header({ filename, score, onDetailClick }: HeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 0.5, sm: 1 }, // Smaller gap on mobile
        mb: 1,
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="subtitle1"
        component="span"
        sx={{
          flexGrow: 1,
          // CRITICAL: Prevent long filename overflow on mobile
          wordBreak: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
          minWidth: 0, // Allow text to shrink
        }}
      >
        {filename}
      </Typography>
      <IconButton
        size="small"
        onClick={onDetailClick}
        sx={{
          bgcolor: "#FFFFFF",
          color: "#000000",
          border: "3px solid #000000",
          borderRadius: 0,
          fontWeight: "bold",
        }}
      >
        <InfoIcon fontSize="small" />
      </IconButton>
      <Chip
        label={`${Math.round(score * 100)}%`}
        size="small"
        sx={{
          bgcolor: "#1565C0",
          color: "#FFFFFF",
          fontWeight: 600,
          border: "1px solid #000000",
        }}
      />
    </Box>
  );
}
