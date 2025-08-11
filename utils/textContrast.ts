import type { Contrastrast } from "../Contrastrast.ts";
import type {
  ContrastOptions,
  ContrastResult,
} from "../types/ContrastTypes.ts";
import { WCAG_LEVELS } from "../constants.ts";
import { contrastRatio } from "./contrastRatio.ts";

/**
 * Analyze text contrast between foreground and background colors
 * @param foreground Foreground color (text color)
 * @param background Background color
 * @param options Configuration options for WCAG compliance checking
 * @returns Contrast ratio number or detailed ContrastResult object
 */
export const textContrast = (
  foreground: Contrastrast | string,
  background: Contrastrast | string,
  options: ContrastOptions = {},
): number | ContrastResult => {
  const { level = "AA", textSize = "normal", returnDetails = false } = options;

  const ratio = contrastRatio(foreground, background);

  if (!returnDetails) {
    return ratio;
  }

  const required = WCAG_LEVELS[level][textSize];
  const passes = ratio >= required;

  return {
    ratio,
    passes,
    details: {
      required,
      actual: ratio,
      level,
      textSize,
    },
  };
};
