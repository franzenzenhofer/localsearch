import { Paper, Typography, Box } from "@mui/material";
import type { ProcessingStatus } from "../types/processing";
import { StatusProgress } from "./StatusProgress";
import { ProcessingStages } from "./ProcessingStages";

interface RealTimeStatusProps {
  show: boolean;
  status: ProcessingStatus;
}

export function RealTimeStatus({ show, status }: RealTimeStatusProps) {
  if (!show) return null;

  return (
    <Paper
      sx={{
        backgroundColor: "#000000",
        color: "#FFFFFF",
        border: "3px solid #FFD700",
        borderRadius: "12px",
        mb: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#FFD700",
          color: "#000000",
          fontWeight: "bold",
          fontSize: "1.5rem",
          p: 2,
        }}
      >
        Real-Time Processing Status
      </Box>

      <Box sx={{ p: 3 }}>
        <StatusProgress
          processedFiles={status.processedFiles}
          totalFiles={status.totalFiles}
          progress={status.progress}
        />

        {status.currentFile && (
          <Box
            sx={{ mb: 3, p: 2, backgroundColor: "#1A1A1A", borderRadius: 2 }}
          >
            <Typography
              variant="body1"
              sx={{ color: "#FFD700", fontWeight: "bold" }}
            >
              Currently Processing: {status.currentFile}
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ color: "#FFFFFF", fontWeight: "bold", mb: 2 }}
          >
            Processing Stages
          </Typography>
          <ProcessingStages currentStage={status.stage} />
        </Box>

        {status.errors.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ color: "#FF1744", fontWeight: "bold", mb: 1 }}
            >
              Processing Errors ({status.errors.length})
            </Typography>
            <Box sx={{ maxHeight: 100, overflow: "auto" }}>
              {status.errors.slice(-3).map((error, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{ color: "#FFCDD2", mb: 1 }}
                >
                  {error}
                </Typography>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
