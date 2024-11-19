import {
  CONTRAST_THRESHOLD,
  DEFAULT_CONTRASTRAST_OPTIONS,
} from "../constants.ts";
import { getRGBFromColorString } from "../helpers/colorStringParsers.ts";
import { ContrastrastOptions } from "../types/contrastrastOptionts.types.ts";

/**
 * Recommends to use either `light` or `dark` text based on the
 * given background color.
 *
 * Color string can be HEX, RGB, or HSL
 *
 * @param   {String}                bgColorString                           Color string of the background.  Can be HEX, RGB, or HSL
 * @param   {ContrastrastOptions}   options                                 (Optional) Partial collection `ContrastrastOptions` that you wish you apply
 * @param   {"dark"|"light"}        [options.fallbackOption="dark"]         Fallback color recommendation, returns on error or unparsable color string.  Defaults to `dark`
 * @param   {Boolean}               [options.throwErrorOnUnhandled=false]   Force option to throw error when invalid/unhandled color string is passed.  Defaults to `false`
 * @return  {"dark"|"light"}                                                Text color recommendation for given color string
 */
export const textContrastForBGColor = (
  bgColorString: string,
  options: Partial<ContrastrastOptions> = {},
): "dark" | "light" => {
  const opts = {
    ...DEFAULT_CONTRASTRAST_OPTIONS,
    ...options,
  };
  try {
    const rgb = getRGBFromColorString(bgColorString);
    // http://www.w3.org/TR/AERT#color-contrast
    const brightness = Math.round(
      (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000,
    );
    return brightness > CONTRAST_THRESHOLD ? "dark" : "light";
  } catch (e) {
    if (opts.throwErrorOnUnhandled) {
      throw new Error(
        `[contrastrast] Error while reading color, using default value "${opts.fallbackOption}"\n`,
      );
    } else {
      console.error(
        `[contrastrast] Error while reading color, using default value "${opts.fallbackOption}"\n`,
        e,
      );
      return opts.fallbackOption;
    }
  }
};
