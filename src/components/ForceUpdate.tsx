import { Box, Typography, Button } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

export function ForceUpdate() {
  const handleForceUpdate = async () => {
    try {
      // Clear all caches
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // Force service worker update
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.update();

        // Listen for new service worker to take control
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          window.location.reload();
        });

        // If there's an updated worker, skip waiting
        const worker = registration.waiting || registration.installing;
        if (worker) {
          worker.postMessage({ type: "SKIP_WAITING" });
        } else {
          // No waiting worker, just reload
          window.location.reload();
        }
      } else {
        // No service worker, just reload
        window.location.reload();
      }
    } catch (error) {
      console.error("Force update failed:", error);
      window.location.reload();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Force app to update to latest version by clearing caches and reloading
      </Typography>
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={handleForceUpdate}
        color="warning"
        size="small"
      >
        Force Update & Reload
      </Button>
    </Box>
  );
}
