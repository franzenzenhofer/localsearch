import { Box, Typography } from "@mui/material";

interface WelcomeMessageProps {
  show: boolean;
}

export function WelcomeMessage({ show }: WelcomeMessageProps) {
  if (!show) return null;

  return (
    <Box sx={{ textAlign: "center", py: 2 }}>
      <Typography
        variant="h5"
        sx={{ color: "#1565C0", fontWeight: 700, mb: 2 }}
      >
        Welcome to FileSearch!
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
        Upload files and folders for private, lightning-fast searching
      </Typography>
    </Box>
  );
}
