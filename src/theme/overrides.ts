// Global responsive and typography overrides
export const globalOverrides = {
  // Global mobile-first responsive overrides
  MuiContainer: {
    styleOverrides: {
      root: {
        maxWidth: "100% !important",
        paddingLeft: "12px",
        paddingRight: "12px",
        "@media (min-width:600px)": {
          paddingLeft: "16px",
          paddingRight: "16px",
        },
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      root: {
        wordWrap: "break-word",
        overflowWrap: "break-word",
        maxWidth: "100%",
      },
      h6: {
        fontWeight: 700, // Bolder headers for native app feel
      },
    },
  },
  // Native app-like Avatar
  MuiAvatar: {
    styleOverrides: {
      root: {
        background: "linear-gradient(45deg, #FFD700 30%, #FFC400 90%)",
        color: "#000000",
      },
    },
  },
};
