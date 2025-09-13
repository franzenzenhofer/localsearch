import { AppBar, Toolbar, Typography } from "@mui/material";

export function AppHeader() {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontSize: { xs: "1.1rem", sm: "1.25rem" }, // Smaller on mobile
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          FileSearch
        </Typography>
        <Typography
          variant="body2"
          color="inherit"
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Smaller on mobile
            display: { xs: "none", sm: "block" }, // Hide on very small screens
          }}
        >
          Private file search
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
