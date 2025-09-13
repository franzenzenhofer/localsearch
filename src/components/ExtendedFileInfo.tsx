import { Box, Typography, Chip, Card, CardContent } from "@mui/material";

interface ExtendedFileInfoProps {
  id: string;
  isImage: boolean;
}

export function ExtendedFileInfo({ id, isImage }: ExtendedFileInfoProps) {
  return (
    <Card sx={{ border: "2px solid #1565C0", borderRadius: 2, height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: "#1565C0", mb: 2 }}>
          {isImage ? "Image Information" : "File Information"}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              ID:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
            >
              {id}
            </Typography>
          </Box>
          {isImage && (
            <>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  EXIF Data:
                </Typography>
                <Typography variant="body2">
                  Available for processing
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  OCR Status:
                </Typography>
                <Chip
                  label="Ready for text extraction"
                  size="small"
                  sx={{ bgcolor: "#E8F5E8", color: "#2E7D32", fontWeight: 600 }}
                />
              </Box>
            </>
          )}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Indexing:
            </Typography>
            <Chip
              label="Fully searchable"
              size="small"
              sx={{ bgcolor: "#E8F5E8", color: "#2E7D32", fontWeight: 600 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
