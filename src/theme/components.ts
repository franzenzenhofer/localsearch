// Native app-like Material-UI component overrides
export const themeComponents = {
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: "#FFFFFF",
        color: "#000000",
        border: "3px solid #000000",
        boxShadow: "none",
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: "0 !important",
        textTransform: "none",
        fontWeight: 700,
        padding: "12px 24px",
        border: "3px solid #000000",
        boxShadow: "none",
      },
      contained: {
        background: "#000000",
        color: "#FFFFFF !important",
        fontWeight: "700 !important",
        border: "3px solid #000000",
        borderRadius: "0 !important",
        "&:disabled": {
          color: "#666666 !important",
        },
      },
      outlined: {
        background: "#FFFFFF",
        color: "#000000 !important",
        fontWeight: "700 !important",
        border: "3px solid #000000",
        borderRadius: "0 !important",
        "&:disabled": {
          color: "#666666 !important",
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: "0 !important",
        border: "3px solid #000000",
        boxShadow: "none",
        wordWrap: "break-word",
        overflowWrap: "break-word",
        maxWidth: "100%",
        boxSizing: "border-box",
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: "0 !important",
          backgroundColor: "#FFFFFF",
          "& fieldset": { borderColor: "#000000", borderWidth: "3px" },
          "&.Mui-focused fieldset": {
            borderColor: "#000000",
            borderWidth: "3px",
          },
        },
      },
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        borderRadius: "0 !important",
        border: "2px solid #000000",
        marginBottom: "4px",
        backgroundColor: "#FFFFFF",
      },
    },
  },
};
