import type { Contrastrast } from "../contrastrast.ts";
import { WCAG_LEVELS } from "../constants.ts";
import { contrastRatio } from "./contrastRatio.ts";

/**
 * Detailed contrast analysis result with WCAG compliance information
 */
export type ContrastResult = {
  /** Contrast ratio (1:1 to 21:1) */
  ratio: number;
  /** WCAG compliance test results */
  passes: {
    /** WCAG AA compliance for normal text (4.5:1 threshold) */
    AA_NORMAL: boolean;
    /** WCAG AA compliance for large text (3:1 threshold) */
    AA_LARGE: boolean;
    /** WCAG AAA compliance for normal text (7:1 threshold) */
    AAA_NORMAL: boolean;
    /** WCAG AAA compliance for large text (4.5:1 threshold) */
    AAA_LARGE: boolean;
  };
};

/**
 * Options for contrast analysis functions
 */
export type ContrastOptions = {
  /** Return detailed WCAG analysis instead of just the ratio (default: false) */
  returnDetails?: boolean;
};

/**
 * Calculate the contrast ratio between foreground and background colors
 * @param foreground Foreground color (text color) - accepts hex, rgb, hsl strings or Contrastrast instance
 * @param background Background color - accepts hex, rgb, hsl strings or Contrastrast instance
 * @returns Contrast ratio as a number (1:1 to 21:1)
 * @example
 * ```typescript
 * const ratio = textContrast("#000000", "#ffffff"); // 21
 * const ratio2 = textContrast("rgb(255, 0, 0)", "#fff"); // 3.998
 * ```
 */
export function textContrast(
  foreground: Contrastrast | string,
  background: Contrastrast | string,
): number;

/**
 * Analyze text contrast with detailed WCAG compliance results
 * @param foreground Foreground color (text color) - accepts hex, rgb, hsl strings or Contrastrast instance
 * @param background Background color - accepts hex, rgb, hsl strings or Contrastrast instance
 * @param options Configuration with returnDetails: true for detailed analysis
 * @returns Detailed contrast analysis with WCAG compliance breakdown
 * @example
 * ```typescript
 * const result = textContrast("#1a73e8", "#ffffff", { returnDetails: true });
 * // {
 * //   ratio: 4.5,
 * //   passes: {
 * //     AA_NORMAL: true,   // 4.5 >= 4.5
 * //     AA_LARGE: true,    // 4.5 >= 3.0
 * //     AAA_NORMAL: false, // 4.5 < 7.0
 * //     AAA_LARGE: true    // 4.5 >= 4.5
 * //   }
 * // }
 * ```
 */
export function textContrast(
  foreground: Contrastrast | string,
  background: Contrastrast | string,
  options: { returnDetails: true },
): ContrastResult;

/**
 * Calculate the contrast ratio between foreground and background colors
 * @param foreground Foreground color (text color) - accepts hex, rgb, hsl strings or Contrastrast instance
 * @param background Background color - accepts hex, rgb, hsl strings or Contrastrast instance
 * @param options Configuration with returnDetails: false (default) for simple ratio
 * @returns Contrast ratio as a number (1:1 to 21:1)
 * @example
 * ```typescript
 * const ratio = textContrast("#000", "#fff", { returnDetails: false }); // 21
 * ```
 */
export function textContrast(
  foreground: Contrastrast | string,
  background: Contrastrast | string,
  options?: ContrastOptions,
): number;

export function textContrast(
  foreground: Contrastrast | string,
  background: Contrastrast | string,
  options: ContrastOptions = {},
): number | ContrastResult {
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
}
