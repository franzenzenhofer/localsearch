/**
 * CARD & COMPONENT STYLES - Super DRY (Under 75 lines)
 */

import { COLORS } from "./colors";

export const CARD_STYLES = {
  PROFESSIONAL: {
    backgroundColor: COLORS.WHITE,
    color: COLORS.BLACK,
    border: `3px solid ${COLORS.BLACK}`,
    borderRadius: 0,
    boxShadow: "none",
  },
  DARK: {
    backgroundColor: COLORS.BLACK,
    color: COLORS.WHITE,
    border: `3px solid ${COLORS.WHITE}`,
    borderRadius: 0,
    boxShadow: "none",
  },
} as const;

export const CHIP_STYLES = {
  PROFESSIONAL: {
    backgroundColor: COLORS.BLACK,
    color: COLORS.WHITE,
    border: `2px solid ${COLORS.BLACK}`,
    borderRadius: 0,
    fontWeight: 600,
  },
  OUTLINE: {
    backgroundColor: COLORS.WHITE,
    color: COLORS.BLACK,
    border: `2px solid ${COLORS.BLACK}`,
    borderRadius: 0,
    fontWeight: 600,
  },
} as const;

export const TEXT_STYLES = {
  HEADING: {
    color: COLORS.BLACK,
    fontWeight: 700,
  },
  BODY: {
    color: COLORS.BLACK,
    fontWeight: 400,
  },
  CAPTION: {
    color: COLORS.BLACK,
    fontWeight: 500,
  },
} as const;

export const BOX_STYLES = {
  PROFESSIONAL_CONTAINER: {
    backgroundColor: COLORS.WHITE,
    color: COLORS.BLACK,
    border: `3px solid ${COLORS.BLACK}`,
    borderRadius: 0,
    padding: 2,
  },
  DARK_CONTAINER: {
    backgroundColor: COLORS.BLACK,
    color: COLORS.WHITE,
    border: `3px solid ${COLORS.WHITE}`,
    borderRadius: 0,
    padding: 2,
  },
} as const;
