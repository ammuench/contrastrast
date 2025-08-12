import type { TextSize, WCAGLevel } from "./types/ContrastTypes.ts";

// WC3 AERT brightness contrast threshold
// Source: https://www.w3.org/TR/AERT/#color-contrast
export const CONTRAST_THRESHOLD = 124;

// WC3 AERT brightness calculation coefficients -- more efficient for quick calculations
// Source: https://www.w3.org/TR/AERT/#color-contrast
export const BRIGHTNESS_COEFFICIENTS = {
  RED: 299,
  GREEN: 587,
  BLUE: 114,
  DIVISOR: 1000,
} as const;

// WCAG 2.1 relative luminance calculation coefficients
// Source: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
export const LUMINANCE_COEFFICIENTS = {
  RED: 0.2126,
  GREEN: 0.7152,
  BLUE: 0.0722,
} as const;

// Gamma correction constants for sRGB color space
// Source: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
export const GAMMA_CORRECTION = {
  THRESHOLD: 0.04045,
  LINEAR_DIVISOR: 12.92,
  GAMMA_OFFSET: 0.055,
  GAMMA_DIVISOR: 1.055,
  GAMMA_EXPONENT: 2.4,
} as const;

// WCAG 2.1 contrast ratio calculation constants
// Source: https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
export const CONTRAST_RATIO = {
  LUMINANCE_OFFSET: 0.05,
} as const;

// WCAG 2.1 minimum contrast thresholds
// Source: https://www.w3.org/TR/WCAG21/#contrast-minimum
// Source: https://www.w3.org/TR/WCAG21/#contrast-enhanced
export const WCAG_LEVELS: Record<WCAGLevel, Record<TextSize, number>> = {
  AA: {
    normal: 4.5,
    large: 3.0,
  },
  AAA: {
    normal: 7.0,
    large: 4.5,
  },
} as const;

// RGB color space bounds
export const RGB_BOUNDS = {
  MIN: 0,
  MAX: 255,
} as const;

// HSL conversion constants
// Source: https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
export const HSL_CONVERSION = {
  LIGHTNESS_THRESHOLD: 0.5,
  HUE_SECTORS: 6,
  FULL_CIRCLE_DEGREES: 360,
  PERCENTAGE_MULTIPLIER: 100,
} as const;
