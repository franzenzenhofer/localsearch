import { Box, Button, ButtonGroup, Chip } from "@mui/material";
import { DebugLogger } from "../utils/DebugLogger";

export function DebugControls() {
  const logger = DebugLogger.getInstance();

  const copyLogs = () => {
    logger.copyLogs();
    console.log(
      "%cDEBUG LOGS COPIED TO CLIPBOARD!",
      "color: #FFD700; font-size: 20px; font-weight: bold; background: black; padding: 8px;",
    );
    console.log("Use Ctrl+V to paste the logs anywhere");
  };

  const clearLogs = () => {
    logger.clearLogs();
    console.log(
      "%cDEBUG LOGS CLEARED - FRESH START!",
      "color: #FFD700; font-size: 20px; font-weight: bold; background: black; padding: 8px;",
    );
  };

  const showSummary = () => {
    logger.showSummary();
    console.log(
      "%cCHECK DEBUG SUMMARY ABOVE",
      "color: #FFD700; font-size: 16px; font-weight: bold; background: black; padding: 4px;",
    );
  };

  const enableDebugMode = () => {
    (window as any).__DEBUG_MODE__ = true;
    logger.info("DEBUG", "Debug mode enabled - all events will be logged");
    console.log(
      "%cTOTAL TRANSPARENCY MODE ACTIVATED!",
      "color: #FFD700; font-size: 24px; font-weight: bold; background: black; padding: 10px;",
    );
    console.log(
      "%cEvery file upload action, search query, and processing step will be logged",
      "color: #4CAF50; font-size: 14px; font-weight: bold;",
    );
    console.log(
      '%cUse "Copy Debug Logs" to get copyable debugging info',
      "color: #2196F3; font-size: 14px; font-weight: bold;",
    );
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Chip
        label="DEBUG CONTROLS"
        sx={{
          backgroundColor: "#000000",
          color: "#FFD700",
          fontWeight: "bold",
          fontSize: "12px",
          border: "2px solid #FFD700",
        }}
      />
      <ButtonGroup
        orientation="vertical"
        variant="contained"
        size="small"
        sx={{
          "& .MuiButton-root": {
            backgroundColor: "#000000",
            color: "#FFD700",
            border: "2px solid #FFD700",
            borderRadius: 0,
          },
        }}
      >
        <Button onClick={enableDebugMode}>Enable Debug</Button>
        <Button onClick={copyLogs}>Copy Logs</Button>
        <Button onClick={showSummary}>Summary</Button>
        <Button onClick={clearLogs}>Clear</Button>
      </ButtonGroup>
    </Box>
  );
}
