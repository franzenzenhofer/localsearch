import { Box, LinearProgress, Typography, Chip } from "@mui/material";
import { COLORS } from "../constants/colors";

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
        <Typography variant="h6" sx={{ color: COLORS.BLACK, fontWeight: "bold" }}>
          Overall Progress
        </Typography>
        <Chip
          label={`${Math.round(progress)}%`}
          sx={{
            backgroundColor: COLORS.GOLD,
            color: COLORS.BLACK,
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
          backgroundColor: COLORS.WHITE,
          "& .MuiLinearProgress-bar": {
            backgroundColor: COLORS.GOLD,
          },
        }}
      />
      <Typography variant="body2" sx={{ color: COLORS.BLACK, mt: 1 }}>
        {processedFiles} of {totalFiles} files processed
      </Typography>
    </Box>
  );
}
