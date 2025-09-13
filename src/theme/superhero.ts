import { createTheme } from "@mui/material";
import { themeComponents } from "./components";
import { globalOverrides } from "./overrides";
import { COLORS } from "../constants/colors";

export const superheroTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: COLORS.BLACK, // PROFESSIONAL BLACK ONLY
      contrastText: COLORS.WHITE,
    },
    secondary: {
      main: COLORS.WHITE, // PROFESSIONAL WHITE ONLY
      contrastText: COLORS.BLACK,
    },
    background: {
      default: "#FFFFFF", // PURE WHITE - MAXIMUM CONTRAST
      paper: "#FFFFFF", // PURE WHITE - PROFESSIONAL
    },
    text: {
      primary: "#000000", // PURE BLACK - MAXIMUM CONTRAST
      secondary: "#000000", // PURE BLACK - PROFESSIONAL
    },
    error: {
      main: "#D32F2F",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#FFD700",
      contrastText: "#000000",
    },
    divider: "#E0E0E0",
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700, color: "#000000" },
    h2: { fontWeight: 600, color: "#000000" },
    h3: { fontWeight: 600, color: "#000000" },
    h4: { fontWeight: 600, color: "#1565C0" },
    h5: { fontWeight: 600, color: "#1565C0" },
    h6: { fontWeight: 600, color: "#1565C0" },
    button: { fontWeight: 600, textTransform: "none" },
  },
  shape: {
    borderRadius: 0, // PROFESSIONAL SHARP CORNERS - NO ROUNDED ANYWHERE
  },
  components: {
    ...themeComponents,
    ...globalOverrides,
  },
});
