import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { ExpandLess as CollapseIcon } from "@mui/icons-material";
import { FileLocationCard } from "./FileLocationCard";
import { BasicFileInfo } from "./BasicFileInfo";
import { ExtendedFileInfo } from "./ExtendedFileInfo";
import { FileDetailContent } from "./FileDetailContent";
import type { FileDetails } from "../types/fileDetails";
import { getFileIcon, isImageFile } from "../utils/file-detail-utils";

interface FileDetailPanelProps {
  expanded: boolean;
  onToggle: () => void;
  fileDetails: FileDetails | null;
}

export function FileDetailPanel({
  expanded,
  onToggle,
  fileDetails,
}: FileDetailPanelProps) {
  if (!fileDetails) return null;

  const FileIcon = getFileIcon(fileDetails.type);
  const isImage = isImageFile(fileDetails.filename, fileDetails.type);

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {expanded && (
        <Card
          sx={{
            bgcolor: "#F8F9FA",
            border: "3px solid #000000",
            borderRadius: 0, // CONSISTENT SHARP CORNERS
            boxShadow: "8px 8px 0px #000000",
            width: "100%",
          }}
        >
          <CardHeader
            avatar={<FileIcon />}
            title={
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                File Details
              </Typography>
            }
            sx={{
              bgcolor: "#FFD700",
              color: "#000000",
              borderBottom: "2px solid #000000",
            }}
          />

          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12}>
                <FileLocationCard path={fileDetails.path} />
              </Grid>
              <Grid item xs={12} md={6}>
                <BasicFileInfo
                  filename={fileDetails.filename}
                  size={fileDetails.size}
                  type={fileDetails.type}
                  lastModified={fileDetails.lastModified}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ExtendedFileInfo id={fileDetails.id} isImage={isImage} />
              </Grid>
              {fileDetails.content && (
                <Grid item xs={12}>
                  <FileDetailContent content={fileDetails.content} />
                </Grid>
              )}
            </Grid>
          </CardContent>

          <CardActions
            sx={{
              p: 3,
              bgcolor: "#F0F0F0",
              borderTop: "2px solid #E0E0E0",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={onToggle}
              variant="contained"
              startIcon={<CollapseIcon />}
              sx={{
                bgcolor: "#000000",
                color: "#FFFFFF",
                fontWeight: 600,
                border: "3px solid #000000",
                borderRadius: 0, // CONSISTENT SHARP CORNERS
              }}
            >
              Collapse Details
            </Button>
          </CardActions>
        </Card>
      )}
    </Box>
  );
}
