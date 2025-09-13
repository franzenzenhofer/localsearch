import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { CheckCircle, ErrorOutline, Schedule } from "@mui/icons-material";

interface ProcessingStagesProps {
  currentStage: string;
}

export function ProcessingStages({ currentStage }: ProcessingStagesProps) {
  const getStageIcon = (stageName: string) => {
    if (currentStage === "error") {
      return <ErrorOutline sx={{ color: "#FF1744" }} />;
    }

    const stages = ["uploading", "processing", "indexing", "complete"];
    const currentIndex = stages.indexOf(currentStage);
    const stageIndex = stages.indexOf(stageName);

    if (stageIndex < currentIndex || currentStage === "complete") {
      return <CheckCircle sx={{ color: "#4CAF50" }} />;
    } else if (stageIndex === currentIndex) {
      return <Schedule sx={{ color: "#FFD700" }} />;
    } else {
      return <Schedule sx={{ color: "#757575" }} />;
    }
  };

  const stages = [
    {
      key: "uploading",
      title: "File Selection & Upload",
      desc: "Reading selected files from disk",
    },
    {
      key: "processing",
      title: "Content Extraction",
      desc: "Extracting searchable text content",
    },
    {
      key: "indexing",
      title: "Search Index Building",
      desc: "Creating searchable database",
    },
    {
      key: "complete",
      title: "Ready for Search",
      desc: "All files indexed and searchable",
    },
  ];

  return (
    <List sx={{ p: 0 }}>
      {stages.map((stage) => (
        <ListItem key={stage.key} sx={{ px: 0 }}>
          <ListItemIcon>{getStageIcon(stage.key)}</ListItemIcon>
          <ListItemText
            primary={stage.title}
            primaryTypographyProps={{ color: "#FFFFFF", fontWeight: "bold" }}
            secondary={stage.desc}
            secondaryTypographyProps={{ color: "#CCCCCC" }}
          />
        </ListItem>
      ))}
    </List>
  );
}
