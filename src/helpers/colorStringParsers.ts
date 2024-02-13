import { RGBValues } from "../types/RGB.types";

import {
  extractRGBValuesFromHex,
  extractRGBValuesFromHSL,
  extractRGBValuesFromRGBStrings,
} from "./convertHexToRGB";

export const getRGBFromColorString = (colorString: string): RGBValues => {
  const [fullRgbMatch, red, green, blue] =
    colorString.match(
      /rgb\((0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),\s*(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),\s*(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d)\)/
    ) || [];
  if (fullRgbMatch) {
    return extractRGBValuesFromRGBStrings(red, green, blue);
  }

  const [, hexMatch] = colorString.match(/#?([a-f0-9]{6}|[a-f0-9]{3})/i) || [];
  if (hexMatch) {
    return extractRGBValuesFromHex(hexMatch);
  }

  const [fullHslMatch, hue, saturation, light] =
    colorString.match(
      /hsl\(\s*(\d+)\s*,\s*(\d*(?:\.\d+)?)%\s*,\s*(\d*(?:\.\d+)?)%\)/i
    ) || [];
  if (fullHslMatch) {
    return extractRGBValuesFromHSL(hue, saturation, light);
  }

  throw new Error(`Unsupported color string "${colorString}"`);
};
