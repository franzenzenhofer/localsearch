/**
 * INDEX INSPECTOR - Complete Visibility (Under 75 lines)
 */

import { Box, Typography, Card, CardContent, Chip } from "@mui/material";
import { COLORS, CARD_STYLES, CHIP_STYLES } from "../constants/styles";
import type { StoredIndex } from "../core/StorageManager";

interface IndexInspectorProps {
  index: StoredIndex;
  show: boolean;
}

export function IndexInspector({ index, show }: IndexInspectorProps) {
  if (!show) return null;

  return (
    <Card sx={{ ...CARD_STYLES.PROFESSIONAL, mt: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: COLORS.BLACK, mb: 2 }}>
          INDEX DETAILS: {index.name}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Chip
            label={`${index.fileCount} Files`}
            sx={CHIP_STYLES.PROFESSIONAL}
          />
          <Chip
            label={`Created: ${new Date(index.created).toLocaleString()}`}
            sx={CHIP_STYLES.OUTLINE}
          />
          <Chip
            label={`Size: ${(JSON.stringify(index).length / 1024).toFixed(1)} KB`}
            sx={CHIP_STYLES.OUTLINE}
          />
        </Box>

        <Typography variant="subtitle2" sx={{ color: COLORS.BLACK, mb: 1 }}>
          INDEXED FILES:
        </Typography>

        <Box
          sx={{
            maxHeight: 200,
            overflow: "auto",
            border: `2px solid ${COLORS.BLACK}`,
            p: 1,
          }}
        >
          {index.files?.slice(0, 50).map((file, idx) => (
            <Typography
              key={idx}
              variant="caption"
              sx={{
                display: "block",
                color: COLORS.BLACK,
                fontFamily: "monospace",
                fontSize: "0.75rem",
              }}
            >
              {idx + 1}. {file.name} ({file.size} bytes)
            </Typography>
          )) || (
            <Typography variant="caption" sx={{ color: COLORS.BLACK }}>
              File details not available - legacy index format
            </Typography>
          )}

          {(index.files?.length || 0) > 50 && (
            <Typography
              variant="caption"
              sx={{ color: COLORS.BLACK, fontStyle: "italic" }}
            >
              ... and {(index.files?.length || 0) - 50} more files
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
