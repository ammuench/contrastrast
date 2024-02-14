import { RGBValues } from "../types/RGB.types";

import {
  extractRGBValuesFromHex,
  extractRGBValuesFromHSL,
  extractRGBValuesFromRGBStrings,
} from "./rgbConverters";

const RGB_REGEX =
  /rgb\((0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),\s*(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),\s*(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d)\)/i;

const HEXCOLOR_REGEX = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i;

const HSL_REGEX =
  /hsl\(\s*(\d+)°{0,1}\s*,\s*(\d*(?:\.\d+)?)%\s*,\s*(\d*(?:\.\d+)?)%\)/i;

export const getRGBFromColorString = (colorString: string): RGBValues => {
  const [fullRgbMatch, red, green, blue] = colorString.match(RGB_REGEX) || [];
  if (fullRgbMatch) {
    return extractRGBValuesFromRGBStrings(red, green, blue);
  }

  const [, hexMatch] = colorString.match(HEXCOLOR_REGEX) || [];
  if (hexMatch) {
    return extractRGBValuesFromHex(hexMatch);
  }

  const [fullHslMatch, hue, saturation, light] =
    colorString.match(HSL_REGEX) || [];
  if (fullHslMatch) {
    return extractRGBValuesFromHSL(hue, saturation, light);
  }

  throw new Error(`Unsupported color string "${colorString}"`);
};
