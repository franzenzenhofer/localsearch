import { Typography } from "@mui/material";

export function DebugPerformance() {
  const memoryMB = (performance as any).memory?.usedJSHeapSize
    ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
    : "N/A";

  return (
    <>
      <Typography variant="body2">Memory Usage: {memoryMB} MB</Typography>
      <Typography variant="body2">Component Count: 15</Typography>
      <Typography variant="body2">Line Limit: 75 per file</Typography>
    </>
  );
}
