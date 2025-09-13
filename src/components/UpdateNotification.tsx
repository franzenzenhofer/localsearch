import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Update as UpdateIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

interface UpdateNotificationProps {
  registration?: ServiceWorkerRegistration | null;
}

export function UpdateNotification({ registration }: UpdateNotificationProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!registration) return;

    const handleWaiting = () => setShowNotification(true);

    // Check if there's already a waiting worker
    if (registration.waiting) {
      setShowNotification(true);
    }

    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            handleWaiting();
          }
        });
      }
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "UPDATE_AVAILABLE") {
        setShowNotification(true);
      }
    });
  }, [registration]);

  const handleUpdate = async () => {
    if (!registration?.waiting) return;
    setUpdating(true);
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  };

  const handleDismiss = () => {
    setShowNotification(false);
  };

  if (!showNotification) return null;

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Card
        sx={{
          bgcolor: "#FFD700",
          border: "3px solid #000000",
          borderRadius: 2,
          boxShadow: "4px 4px 0px #000000",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}
            >
              <UpdateIcon sx={{ color: "#000000" }} />
              <Box>
                <Typography
                  variant="h6"
                  sx={{ color: "#000000", fontWeight: 700, mb: 0.5 }}
                >
                  New Version Available!
                </Typography>
                <Typography variant="body2" sx={{ color: "#000000" }}>
                  A new version of LocalSearch is ready. Click "Update Now" to
                  reload and get the latest features.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button
                onClick={handleUpdate}
                variant="contained"
                size="small"
                disabled={updating}
                startIcon={updating ? <DownloadIcon /> : <UpdateIcon />}
                sx={{
                  bgcolor: "#000000",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  border: "3px solid #000000",
                  borderRadius: 0, // NO HOVER STATES - MOBILE FIRST
                }}
              >
                {updating ? "Updating..." : "Update Now"}
              </Button>

              <IconButton
                onClick={handleDismiss}
                size="small"
                sx={{
                  bgcolor: "#FFFFFF",
                  color: "#000000",
                  border: "3px solid #000000",
                  borderRadius: 0, // NO HOVER STATES - MOBILE FIRST
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
