import React, { useState, useEffect } from "react";
import { Box, Chip } from "@mui/material";
import { WifiOff as OfflineIcon } from "@mui/icons-material";

export function ConnectivityStatus() {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for service worker messages about cache fallbacks
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "CACHE_FALLBACK_USED") {
          setIsOnline(false);
        }
      });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Only show indicator when offline
  if (isOnline) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 9999,
      }}
    >
      <Chip
        icon={<OfflineIcon />}
        label="Offline — using cached version"
        sx={{
          bgcolor: "#FFFFFF", // WHITE BACKGROUND ONLY
          color: "#000000", // BLACK TEXT ON WHITE
          fontWeight: 600,
          border: "3px solid #000000", // BLACK BORDER FOR CONTRAST
          "& .MuiChip-icon": {
            color: "#000000", // BLACK ICON
          },
        }}
      />
    </Box>
  );
}
