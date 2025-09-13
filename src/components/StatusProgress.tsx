import { Box, LinearProgress, Typography, Chip } from "@mui/material";

interface StatusProgressProps {
  processedFiles: number;
  totalFiles: number;
  progress: number;
}

export function StatusProgress({
  processedFiles,
  totalFiles,
  progress,
}: StatusProgressProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
          Overall Progress
        </Typography>
        <Chip
          label={`${Math.round(progress)}%`}
          sx={{
            backgroundColor: "#FFD700",
            color: "#000000",
            fontWeight: "bold",
          }}
        />
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 12,
          borderRadius: 6,
          backgroundColor: "#333333",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#FFD700",
          },
        }}
      />
      <Typography variant="body2" sx={{ color: "#CCCCCC", mt: 1 }}>
        {processedFiles} of {totalFiles} files processed
      </Typography>
    </Box>
  );
}
