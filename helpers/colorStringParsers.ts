import type { RGBValues } from "../types/Colors.types.ts";

import {
  extractRGBValuesFromHex,
  extractRGBValuesFromHSL,
  extractRGBValuesFromRGBStrings,
} from "./rgbConverters.ts";

const RGB_REGEX =
  /rgb\((0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),\s*(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),\s*(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d)\)/i;

const HEXCOLOR_REGEX = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i;

const HSL_REGEX =
  /hsl\(\s*((?:360|3[0-5][0-9]|2[0-9][0-9]|1[0-9][0-9]|(?:100|0{0,1}[0-9][0-9]|0{0,1}0{0,1}[0-9])))(?:°|deg){0,1}\s*,{0,1}\s*((?:100|0{0,1}[0-9][0-9]|0{0,1}0{0,1}[0-9])(?:\.\d+)?)%{0,1}\s*,{0,1}\s*((?:100|0{0,1}[0-9][0-9]|0{0,1}0{0,1}[0-9])(?:\.\d+)?)%{0,1}\)/i;

/**
 * Parse a color string and extract RGB values
 * Supports hex ("#abc", "#abcdef"), rgb ("rgb(r,g,b)"), and hsl ("hsl(h,s%,l%)") format strings
 * @param colorString Color string in supported format
 * @returns RGB values object with r, g, b properties (0-255)
 * @throws {Error} When the color string format is not supported or invalid
 * @example
 * ```typescript
 * const rgb1 = getRGBFromColorString("#ff0000"); // { r: 255, g: 0, b: 0 }
 * const rgb2 = getRGBFromColorString("rgb(255, 0, 0)"); // { r: 255, g: 0, b: 0 }
 * const rgb3 = getRGBFromColorString("hsl(0, 100%, 50%)"); // { r: 255, g: 0, b: 0 }
 * ```
 */
export const getRGBFromColorString = (colorString: string): RGBValues => {
  const [fullRgbMatch, red, green, blue] = colorString.match(RGB_REGEX) || [];
  if (fullRgbMatch) {
    return extractRGBValuesFromRGBStrings(red, green, blue);
  }

  const [, hexMatch] = colorString.match(HEXCOLOR_REGEX) || [];
  if (hexMatch) {
    return extractRGBValuesFromHex(hexMatch);
  }

  const [fullHslMatch, hue, saturation, light] = colorString.match(HSL_REGEX) ||
    [];
  if (fullHslMatch) {
    return extractRGBValuesFromHSL(hue, saturation, light);
  }

  throw new Error(`Unsupported color string "${colorString}"`);
};
