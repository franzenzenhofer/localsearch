/**
 * KISS DESIGN SYSTEM - SUPER DRY COLOR CONSTANTS
 * Only BLACK and WHITE allowed - maximum professional contrast
 */

export const COLORS = {
  // CORE COLORS - Only these two allowed
  BLACK: "#000000",
  WHITE: "#FFFFFF",

  // DEPRECATED - Remove these from all components
  BLUE: "#1565C0", // ❌ NOT ALLOWED
  GOLD: "#FFD700", // ❌ NOT ALLOWED
  GRAY: "#666666", // ❌ NOT ALLOWED
} as const;

// SUPER DRY STYLE CONSTANTS
export const STYLES = {
  BORDER_BOLD: `3px solid ${COLORS.BLACK}`,
  BORDER_RADIUS: 0,
  FONT_WEIGHT_BOLD: 700,
} as const;

// BACKGROUND/TEXT COMBINATIONS - Only these allowed
export const THEME_COMBOS = {
  BLACK_BG: {
    backgroundColor: COLORS.BLACK,
    color: COLORS.WHITE,
    border: `3px solid ${COLORS.WHITE}`,
  },
  WHITE_BG: {
    backgroundColor: COLORS.WHITE,
    color: COLORS.BLACK,
    border: `3px solid ${COLORS.BLACK}`,
  },
} as const;
