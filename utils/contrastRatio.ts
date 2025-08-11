import { Contrastrast } from "../Contrastrast.ts";
import { CONTRAST_RATIO } from "../constants.ts";

/**
 * Calculate the WCAG 2.1 contrast ratio between two colors
 * @param color1 First color (Contrastrast instance or color string)
 * @param color2 Second color (Contrastrast instance or color string)
 * @returns Contrast ratio (1:1 to 21:1)
 */
export const contrastRatio = (
  color1: Contrastrast | string,
  color2: Contrastrast | string,
): number => {
  const c1 = color1 instanceof Contrastrast ? color1 : new Contrastrast(color1);
  const c2 = color2 instanceof Contrastrast ? color2 : new Contrastrast(color2);

  const l1 = c1.luminance();
  const l2 = c2.luminance();

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + CONTRAST_RATIO.LUMINANCE_OFFSET) /
    (darker + CONTRAST_RATIO.LUMINANCE_OFFSET);
};
