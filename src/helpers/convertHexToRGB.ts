import { RGBValues } from "../types/RGB.types";

/**
 * Converts a HEX color value to RGB
 * Assumes hex code has the `#` stripped and is in 3 or 6 length configuration
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {string}    hexString   3 or 6 length hex code string with `#` removed
 * @return  {RGBValues}             The RGB representation
 */
export const extractRGBValuesFromHex = (hexString: string): RGBValues => {
  let safeHexString = hexString;
  if (hexString.length === 3) {
    // Expand hex if written in shorthand
    safeHexString = Array.from(hexString)
      .map((char) => char + char)
      .join("");
  }
  const r = parseInt(safeHexString.slice(0, 2), 16);
  const g = parseInt(safeHexString.slice(2, 4), 16);
  const b = parseInt(safeHexString.slice(4, 6), 16);

  return { r, g, b };
};

/**
 * HSL to RGB Parser from https://gist.github.com/mjackson/5311256
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from https://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {string}    hueString               The hue
 * @param   {string}    saturationString        The saturation
 * @param   {string}    lightString             The lightness
 * @return  {RGBValues}                         The RGB representation
 */
export const extractRGBValuesFromHSL = (
  hueString: string,
  saturationString: string,
  lightString: string
): RGBValues => {
  // Divide input values by their range to get them into the expected
  // [0,1] set expected by rest of equation.  Hue uses 360 because it's based on degrees
  const h = parseInt(hueString, 10) / 360;
  const s = parseInt(saturationString, 10) / 100;
  const l = parseInt(lightString, 10) / 100;

  let r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3) * 255;
    g = hue2rgb(p, q, h) * 255;
    b = hue2rgb(p, q, h - 1 / 3) * 255;
  }

  return {
    r,
    g,
    b,
  };
};

/**
 * Parses and formats RGBValues from red, green, blue string values
 *
 * @param   {string}    redString     The hue
 * @param   {string}    greenString   The saturation
 * @param   {string}    blueString    The lightness
 * @return  {RGBValues}               The RGB representation
 */
export const extractRGBValuesFromRGBStrings = (
  redString: string,
  greenString: string,
  blueString: string
): RGBValues => {
  return {
    r: parseInt(redString, 10),
    b: parseInt(blueString, 10),
    g: parseInt(greenString, 10),
  };
};
