import { getRGBFromColorString } from "./helpers/colorStringParsers";
import { CONTRAST_THRESHOLD } from "./constants";

type ContrastOptions = "dark" | "light";

/**
 * Recommends to use either `light` or `dark` text based on the
 * given background color.
 *
 * Color string can be HEX, RGB, or HSL
 *
 * @param   {string}            bgColorString           Color string of the background.  can be HEX, RGB, or HSL
 * @param   {ContrastOptions}   [fallbackOption="dark"] Fallback color recommendation, returns on error or unparsable color string.  Defaults to `dark`
 * @return  {ContrastOptions}                           Text color recommendation for given color string
 */
export const textContrastForBGColor = (
  bgColorString: string,
  fallbackOption: ContrastOptions = "dark"
): ContrastOptions => {
  try {
    const rgb = getRGBFromColorString(bgColorString);
    // http://www.w3.org/TR/AERT#color-contrast
    const brightness = Math.round(
      (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    );
    return brightness > CONTRAST_THRESHOLD ? "dark" : "light";
  } catch (e) {
    console.error(
      `[contrastrast] Error while reading color, using default value "${fallbackOption}"\n`,
      e
    );
    return fallbackOption;
  }
};
