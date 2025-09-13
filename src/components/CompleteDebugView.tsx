import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Chip,
  Grid,
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { DebugLogger } from "../utils/DebugLogger";
import { useSearch } from "../hooks/useSearch";
import { useState, useEffect } from "react";
import packageJson from "../../package.json";
import { COLORS, THEME_COMBOS } from "../constants/colors";

export function CompleteDebugView() {
  const logger = DebugLogger.getInstance();
  const { fileCount } = useSearch();
  const [logs, setLogs] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const buildDate = new Date().toLocaleDateString();

  // Performance monitoring
  const memoryMB = (performance as any).memory?.usedJSHeapSize
    ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
    : "N/A";

  // Auto-update logs every second
  useEffect(() => {
    const interval = window.setInterval(() => {
      const currentLogs = logger.getLogs();
      setLogs([...currentLogs]);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [logger]);

  // Enable debug mode by default and set global version
  useEffect(() => {
    (window as any).__DEBUG_MODE__ = true;
    (window as any).__APP_VERSION__ = packageJson.version;
    (window as any).__BUILD_DATE__ = buildDate;
    logger.info("DEBUG", "Transparency mode active by default");
    console.log(
      "LocalSearch v" + packageJson.version + " - Build: " + buildDate,
    );
  }, [logger, buildDate]);

  const copyLogs = () => {
    logger.copyLogs();
    alert("Debug logs copied to clipboard!");
  };

  const clearLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  const handleForceUpdate = async () => {
    try {
      logger.info("UPDATE", "Force update initiated");

      // Clear all caches
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        logger.info("UPDATE", "All caches cleared");
      }

      // Force service worker update
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.update();
        logger.info("UPDATE", "Service worker update requested");

        navigator.serviceWorker.addEventListener("controllerchange", () => {
          window.location.reload();
        });

        const worker = registration.waiting || registration.installing;
        if (worker) {
          worker.postMessage({ type: "SKIP_WAITING" });
        } else {
          window.location.reload();
        }
      } else {
        window.location.reload();
      }
    } catch (error) {
      logger.error("UPDATE", "Force update failed", { error: error.message });
      window.location.reload();
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        backgroundColor: "#000000",
        ...THEME_COMBOS.WHITE_BG,
        borderRadius: 2,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Header with App Status */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: COLORS.BLACK, fontWeight: "bold" }}
          >
            LocalSearch v{packageJson.version}
          </Typography>
          <Chip
            label={`Build ${buildDate}`}
            size="small"
            sx={{ ...THEME_COMBOS.BLACK_BG, fontSize: "0.7rem" }}
          />
        </Box>

        {/* Mobile-First Stats Grid */}
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" sx={{ color: "#4CAF50" }}>
              Files: {fileCount}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" sx={{ color: "#4CAF50" }}>
              Memory: {memoryMB} MB
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" sx={{ color: "#4CAF50" }}>
              Engine: Active
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" sx={{ color: "#4CAF50" }}>
              Storage: IndexedDB
            </Typography>
          </Grid>
        </Grid>

        {/* Mobile-Optimized Action Buttons */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Button
            size="small"
            variant="contained"
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{
              backgroundColor: "#000000",
              color: "#FFFFFF",
              border: "2px solid #FFFFFF",
              minWidth: "auto",
            }}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={copyLogs}
            sx={{
              backgroundColor: "#000000",
              color: "#FFFFFF",
              border: "2px solid #FFFFFF",
              minWidth: "auto",
            }}
          >
            Copy
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={clearLogs}
            sx={{
              backgroundColor: "#000000",
              color: "#FFFFFF",
              border: "2px solid #FFFFFF",
              minWidth: "auto",
            }}
          >
            Clear
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleForceUpdate}
            sx={{
              backgroundColor: "#FFFFFF",
              color: "#000000",
              border: "2px solid #000000",
              minWidth: "auto",
            }}
          >
            Update
          </Button>
        </Box>
      </Box>

      {/* Live Debug Logs - Always Visible by Default */}
      <Box
        sx={{
          backgroundColor: "#1A1A1A",
          p: 2,
          borderRadius: 1,
          border: "1px solid #333",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Typography variant="subtitle2" sx={{ color: "#4CAF50", mb: 1 }}>
          Live Logs ({logs.length} entries) - Updates every second
        </Typography>
        <Divider sx={{ borderColor: COLORS.BLACK, mb: 1 }} />

        <Box
          sx={{
            maxHeight: isExpanded ? "300px" : "150px",
            overflow: "auto",
            fontFamily: "monospace",
            fontSize: "11px",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#333",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: COLORS.BLACK,
              color: COLORS.WHITE,
              borderRadius: "3px",
            },
          }}
        >
          {logs.length === 0 ? (
            <Typography
              sx={{
                color: COLORS.BLACK,
                fontStyle: "italic",
                textAlign: "center",
                py: 2,
              }}
            >
              Ready for action! Upload files or search to see live
              information...
            </Typography>
          ) : (
            logs.slice(-30).map((log, index) => (
              <Box
                key={index}
                sx={{ mb: 1, p: 1, borderRadius: 1, backgroundColor: "#222" }}
              >
                <Typography
                  component="div"
                  sx={{
                    color:
                      log.level === "ERROR"
                        ? "#FF5252"
                        : log.level === "SUCCESS"
                          ? "#4CAF50"
                          : COLORS.BLACK, // ALL LOGS BLACK - NO COLOR CODING
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  [{new Date(log.timestamp).toLocaleTimeString()}] {log.level} [
                  {log.category}]
                </Typography>
                <Typography
                  component="div"
                  sx={{
                    color: "#FFFFFF",
                    fontSize: "11px",
                    mt: 0.5,
                    wordBreak: "break-word",
                  }}
                >
                  {log.message}
                </Typography>
                {log.data && (
                  <Typography
                    component="pre"
                    sx={{
                      color: "#CCCCCC",
                      fontSize: "9px",
                      mt: 0.5,
                      whiteSpace: "pre-wrap",
                      maxWidth: "100%",
                      overflow: "hidden",
                      backgroundColor: "#111",
                      p: 0.5,
                      borderRadius: 0.5,
                    }}
                  >
                    {JSON.stringify(log.data, null, 2)}
                  </Typography>
                )}
              </Box>
            ))
          )}
        </Box>
      </Box>

      <Typography
        variant="caption"
        sx={{ mt: 2, color: "#FFFFFF", display: "block", textAlign: "center" }}
      >
        Mobile-First Transparency - Everything Visible
      </Typography>
    </Paper>
  );
}
