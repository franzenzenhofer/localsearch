/**
 * BUTTON STYLES - Super DRY (Under 75 lines)
 */

import { COLORS } from "./colors";

export const BUTTON_STYLES = {
  PROFESSIONAL: {
    backgroundColor: COLORS.BLACK,
    color: COLORS.WHITE,
    border: `3px solid ${COLORS.BLACK}`,
    borderRadius: 0,
    fontWeight: 700,
    textTransform: "none" as const,
    "&:disabled": {
      backgroundColor: COLORS.WHITE,
      color: COLORS.BLACK,
      opacity: 0.6,
    },
  },
  OUTLINE: {
    backgroundColor: COLORS.WHITE,
    color: COLORS.BLACK,
    border: `3px solid ${COLORS.BLACK}`,
    borderRadius: 0,
    fontWeight: 700,
    textTransform: "none" as const,
  },
} as const;
