import type { Contrastrast } from "../contrastrast.ts";
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
 * @param options (Optional) Configuration options for WCAG compliance checking
 * @param options.returnDetails When `true` returns the ratio and full WCAG breakdown, when `false` returns only the ratio as a `number`
 * @returns Contrast ratio number or detailed ContrastResult object
 */
export const textContrast = (
  foreground: Contrastrast | string,
  background: Contrastrast | string,
  options: ContrastOptions = {},
): number | ContrastResult => {
  const { returnDetails = false } = options;

  const ratio = contrastRatio(foreground, background);

  if (!returnDetails) {
    return ratio;
  }

  const passes = {
    AA_NORMAL: ratio >= WCAG_LEVELS["AA"]["normal"],
    AA_LARGE: ratio >= WCAG_LEVELS["AA"]["large"],
    AAA_NORMAL: ratio >= WCAG_LEVELS["AAA"]["normal"],
    AAA_LARGE: ratio >= WCAG_LEVELS["AAA"]["large"],
  };

  return {
    ratio,
    passes,
  };
};
