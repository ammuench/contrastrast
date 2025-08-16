import { getRGBFromColorString } from "./helpers/colorStringParsers.ts";
import {
  BRIGHTNESS_COEFFICIENTS,
  CONTRAST_THRESHOLD,
  GAMMA_CORRECTION,
  HSL_CONVERSION,
  LUMINANCE_COEFFICIENTS,
  RGB_BOUNDS,
  WCAG_LEVELS,
} from "./constants.ts";
import { contrastRatio } from "./utils/contrastRatio.ts";
import {
  type ContrastOptions,
  type ContrastResult,
  textContrast,
} from "./utils/textContrast.ts";
import type { HSLValues, RGBValues } from "./types/Colors.types.ts";
import type { WCAGContrastLevel, WCAGTextSize } from "./types/WCAG.types.ts";

/**
 * A comprehensive color manipulation class that supports parsing, conversion, and accessibility analysis
 * @example
 * ```typescript
 * const color = new Contrastrast("#1a73e8");
 * const isLight = color.isLight(); // false
 * const hexValue = color.toHex(); // "#1a73e8"
 * const ratio = color.contrastRatio("#ffffff"); // 4.5
 * ```
 */
export class Contrastrast {
  private readonly rgb: RGBValues;

  /**
   * Create a new Contrastrast instance from a color string
   * @param colorString Color string in hex (#abc or #abcdef), rgb (rgb(r,g,b)), or hsl (hsl(h,s%,l%)) format
   * @throws {Error} When the color string format is not supported
   * @example
   * ```typescript
   * const color1 = new Contrastrast("#ff0000");
   * const color2 = new Contrastrast("rgb(255, 0, 0)");
   * const color3 = new Contrastrast("hsl(0, 100%, 50%)");
   * ```
   */
  constructor(colorString: string) {
    this.rgb = getRGBFromColorString(colorString);
  }

  // Parser/Creator Methods
  /**
   * Create a Contrastrast instance from a hex color string
   * @param hex Hex color string with or without # prefix (e.g., "#ff0000" or "ff0000")
   * @returns New Contrastrast instance
   * @example
   * ```typescript
   * const red1 = Contrastrast.fromHex("#ff0000");
   * const red2 = Contrastrast.fromHex("ff0000");
   * const shortRed = Contrastrast.fromHex("#f00");
   * ```
   */
  static fromHex = (hex: string): Contrastrast => {
    const normalizedHex = hex.startsWith("#") ? hex : `#${hex}`;
    return new Contrastrast(normalizedHex);
  };

  /**
   * Create a Contrastrast instance from RGB values as separate parameters
   * @param r Red value (0-255)
   * @param g Green value (0-255)
   * @param b Blue value (0-255)
   * @returns New Contrastrast instance
   */
  static fromRgb(r: number, g: number, b: number): Contrastrast;
  /**
   * Create a Contrastrast instance from an RGB values object
   * @param rgb RGB values object with r, g, b properties
   * @returns New Contrastrast instance
   */
  static fromRgb(rgb: RGBValues): Contrastrast;
  /**
   * Create a Contrastrast instance from RGB values
   * @param rOrRgb Either red value (0-255) or RGB values object
   * @param g Green value (0-255) when first parameter is red value
   * @param b Blue value (0-255) when first parameter is red value
   * @returns New Contrastrast instance
   * @example
   * ```typescript
   * const red1 = Contrastrast.fromRgb(255, 0, 0);
   * const red2 = Contrastrast.fromRgb({ r: 255, g: 0, b: 0 });
   * ```
   */
  static fromRgb(
    rOrRgb: number | RGBValues,
    g?: number,
    b?: number,
  ): Contrastrast {
    if (typeof rOrRgb === "object") {
      return new Contrastrast(`rgb(${rOrRgb.r}, ${rOrRgb.g}, ${rOrRgb.b})`);
    }
    return new Contrastrast(`rgb(${rOrRgb}, ${g}, ${b})`);
  }

  /**
   * Create a Contrastrast instance from HSL values as separate parameters
   * @param h Hue value (0-360 degrees)
   * @param s Saturation value (0-100 percent)
   * @param l Lightness value (0-100 percent)
   * @returns New Contrastrast instance
   */
  static fromHsl(h: number, s: number, l: number): Contrastrast;
  /**
   * Create a Contrastrast instance from an HSL values object
   * @param hsl HSL values object with h, s, l properties
   * @returns New Contrastrast instance
   */
  static fromHsl(hsl: HSLValues): Contrastrast;
  /**
   * Create a Contrastrast instance from HSL values
   * @param hOrHsl Either hue value (0-360) or HSL values object
   * @param s Saturation value (0-100) when first parameter is hue value
   * @param l Lightness value (0-100) when first parameter is hue value
   * @returns New Contrastrast instance
   * @example
   * ```typescript
   * const red1 = Contrastrast.fromHsl(0, 100, 50);
   * const red2 = Contrastrast.fromHsl({ h: 0, s: 100, l: 50 });
   * ```
   */
  static fromHsl(
    hOrHsl: number | HSLValues,
    s?: number,
    l?: number,
  ): Contrastrast {
    if (typeof hOrHsl === "object") {
      return new Contrastrast(`hsl(${hOrHsl.h}, ${hOrHsl.s}%, ${hOrHsl.l}%)`);
    }
    return new Contrastrast(`hsl(${hOrHsl}, ${s}%, ${l}%)`);
  }

  /**
   * Parse a color string into a Contrastrast instance (alias for constructor)
   * @param colorString Color string in hex, rgb, or hsl format
   * @returns New Contrastrast instance
   * @example
   * ```typescript
   * const color = Contrastrast.parse("#1a73e8");
   * ```
   */
  static parse = (colorString: string): Contrastrast =>
    new Contrastrast(colorString);

  // Conversion & Output Methods
  /**
   * Convert the color to a hex string representation
   * @param includeHash Whether to include the # prefix (default: true)
   * @returns Hex color string (e.g., "#ff0000" or "ff0000")
   * @example
   * ```typescript
   * const color = new Contrastrast("rgb(255, 0, 0)");
   * const withHash = color.toHex(); // "#ff0000"
   * const withoutHash = color.toHex(false); // "ff0000"
   * ```
   */
  toHex = (includeHash: boolean = true): string => {
    const toHex = (n: number) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    const hexValue = toHex(this.rgb.r) + toHex(this.rgb.g) + toHex(this.rgb.b);
    return includeHash ? `#${hexValue}` : hexValue;
  };

  /**
   * Get the RGB values as an object
   * @returns RGB values object with r, g, b properties (0-255)
   * @example
   * ```typescript
   * const color = new Contrastrast("#ff0000");
   * const rgb = color.toRgb(); // { r: 255, g: 0, b: 0 }
   * ```
   */
  toRgb = (): RGBValues => ({ ...this.rgb });

  /**
   * Convert the color to an RGB string representation
   * @returns RGB color string (e.g., "rgb(255, 0, 0)")
   * @example
   * ```typescript
   * const color = new Contrastrast("#ff0000");
   * const rgbString = color.toRgbString(); // "rgb(255, 0, 0)"
   * ```
   */
  toRgbString = (): string =>
    `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`;

  /**
   * Convert the color to HSL values
   * @returns HSL values object with h (0-360), s (0-100), l (0-100) properties
   * @example
   * ```typescript
   * const color = new Contrastrast("#ff0000");
   * const hsl = color.toHsl(); // { h: 0, s: 100, l: 50 }
   * ```
   */
  toHsl = (): HSLValues => {
    const r = this.rgb.r / RGB_BOUNDS.MAX;
    const g = this.rgb.g / RGB_BOUNDS.MAX;
    const b = this.rgb.b / RGB_BOUNDS.MAX;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > HSL_CONVERSION.LIGHTNESS_THRESHOLD
        ? d / (2 - max - min)
        : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? HSL_CONVERSION.HUE_SECTORS : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
      h /= HSL_CONVERSION.HUE_SECTORS;
    }

    return {
      h: Math.round(h * HSL_CONVERSION.FULL_CIRCLE_DEGREES),
      s: Math.round(s * HSL_CONVERSION.PERCENTAGE_MULTIPLIER),
      l: Math.round(l * HSL_CONVERSION.PERCENTAGE_MULTIPLIER),
    };
  };

  /**
   * Convert the color to an HSL string representation
   * @returns HSL color string (e.g., "hsl(0, 100%, 50%)")
   * @example
   * ```typescript
   * const color = new Contrastrast("#ff0000");
   * const hslString = color.toHslString(); // "hsl(0, 100%, 50%)"
   * ```
   */
  toHslString = (): string => {
    const hsl = this.toHsl();
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  };

  /**
   * Calculate the WCAG 2.1 relative luminance of the color
   * @returns Luminance value between 0 (darkest) and 1 (lightest)
   * @example
   * ```typescript
   * const black = new Contrastrast("#000000");
   * const white = new Contrastrast("#ffffff");
   * console.log(black.luminance()); // 0
   * console.log(white.luminance()); // 1
   * ```
   */
  luminance = (): number => {
    const gammaCorrect = (colorValue: number): number => {
      const c = colorValue / RGB_BOUNDS.MAX;
      return c <= GAMMA_CORRECTION.THRESHOLD
        ? c / GAMMA_CORRECTION.LINEAR_DIVISOR
        : Math.pow(
          (c + GAMMA_CORRECTION.GAMMA_OFFSET) /
            GAMMA_CORRECTION.GAMMA_DIVISOR,
          GAMMA_CORRECTION.GAMMA_EXPONENT,
        );
    };

    const rLinear = gammaCorrect(this.rgb.r);
    const gLinear = gammaCorrect(this.rgb.g);
    const bLinear = gammaCorrect(this.rgb.b);

    return (
      LUMINANCE_COEFFICIENTS.RED * rLinear +
      LUMINANCE_COEFFICIENTS.GREEN * gLinear +
      LUMINANCE_COEFFICIENTS.BLUE * bLinear
    );
  };

  /**
   * Calculate the perceived brightness of the color using the WCAG formula
   * @returns Brightness value between 0 (darkest) and 255 (brightest)
   * @example
   * ```typescript
   * const color = new Contrastrast("#1a73e8");
   * const brightness = color.brightness(); // ~102.4
   * ```
   */
  brightness = (): number =>
    (this.rgb.r * BRIGHTNESS_COEFFICIENTS.RED +
      this.rgb.g * BRIGHTNESS_COEFFICIENTS.GREEN +
      this.rgb.b * BRIGHTNESS_COEFFICIENTS.BLUE) /
    BRIGHTNESS_COEFFICIENTS.DIVISOR;

  /* Utility Methods */
  /**
   * Determine if the color is considered "light" based on WCAG brightness threshold
   * @returns True if the color is light (brightness > 124), false otherwise
   * @example
   * ```typescript
   * const lightColor = new Contrastrast("#ffffff");
   * const darkColor = new Contrastrast("#000000");
   * console.log(lightColor.isLight()); // true
   * console.log(darkColor.isLight()); // false
   * ```
   */
  isLight = (): boolean => this.brightness() > CONTRAST_THRESHOLD;

  /**
   * Determine if the color is considered "dark" based on WCAG brightness threshold
   * @returns True if the color is dark (brightness <= 124), false otherwise
   * @example
   * ```typescript
   * const lightColor = new Contrastrast("#ffffff");
   * const darkColor = new Contrastrast("#000000");
   * console.log(lightColor.isDark()); // false
   * console.log(darkColor.isDark()); // true
   * ```
   */
  isDark = (): boolean => !this.isLight();

  /**
   * Calculate the WCAG 2.1 contrast ratio between this color and another color
   * @param color Color to compare against - accepts hex, rgb, hsl strings or Contrastrast instance
   * @returns Contrast ratio from 1:1 (no contrast) to 21:1 (maximum contrast)
   * @example
   * ```typescript
   * const bgColor = new Contrastrast("#1a73e8");
   * const ratio = bgColor.contrastRatio("#ffffff"); // 4.5
   * ```
   */
  contrastRatio = (color: Contrastrast | string): number =>
    contrastRatio(this, color);

  /**
   * Calculate the contrast ratio between this color and another color
   * @param comparisonColor Color to compare against - accepts hex, rgb, hsl strings or Contrastrast instance
   * @param role Role of this color instance in the contrast calculation
   * @returns Contrast ratio as a number (1:1 to 21:1)
   * @example
   * ```typescript
   * const bgColor = new Contrastrast("#1a73e8");
   * const ratio = bgColor.textContrast("#ffffff"); // 4.5 (current as background, white as foreground)
   * const ratio2 = bgColor.textContrast("#ffffff", "foreground"); // 4.5 (current as foreground, white as background)
   * ```
   */
  textContrast(
    comparisonColor: Contrastrast | string,
    role?: "foreground" | "background",
  ): number;

  /**
   * Analyze text contrast with detailed WCAG compliance results
   * @param comparisonColor Color to compare against - accepts hex, rgb, hsl strings or Contrastrast instance
   * @param role Role of this color instance in the contrast calculation
   * @param options Configuration with returnDetails: true for detailed analysis
   * @returns Detailed contrast analysis with WCAG compliance breakdown
   * @example
   * ```typescript
   * const bgColor = new Contrastrast("#1a73e8");
   * const result = bgColor.textContrast("#ffffff", "background", { returnDetails: true });
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
  textContrast(
    comparisonColor: Contrastrast | string,
    role: "foreground" | "background",
    options: { returnDetails: true },
  ): ContrastResult;

  /**
   * Calculate the contrast ratio between this color and another color
   * @param comparisonColor Color to compare against - accepts hex, rgb, hsl strings or Contrastrast instance
   * @param role Role of this color instance in the contrast calculation
   * @param options Configuration with returnDetails: false (default) for simple ratio
   * @returns Contrast ratio as a number (1:1 to 21:1)
   */
  textContrast(
    comparisonColor: Contrastrast | string,
    role?: "foreground" | "background",
    options?: ContrastOptions,
  ): number;

  // Implementation
  textContrast(
    comparisonColor: Contrastrast | string,
    role: "foreground" | "background" = "background",
    options: ContrastOptions = {},
  ): number | ContrastResult {
    if (role === "background") {
      // Current color is background, comparisonColor is foreground (text color)
      return textContrast(comparisonColor, this, options);
    } else {
      // Current color is foreground (text color), comparisonColor is background
      return textContrast(this, comparisonColor, options);
    }
  }

  /**
   * Check if the color combination meets specific WCAG contrast requirements
   * @param comparisonColor Color to compare against - accepts hex, rgb, hsl strings or Contrastrast instance
   * @param role Role of this color instance ("foreground" for text color, "background" for background color)
   * @param targetWcagLevel Target WCAG compliance level ("AA" or "AAA")
   * @param textSize Text size category ("normal" or "large") - affects required contrast ratio
   * @returns True if the combination meets the specified WCAG requirements
   * @example
   * ```typescript
   * const bgColor = new Contrastrast("#1a73e8");
   * const meetsAA = bgColor.meetsWCAG("#ffffff", "background", "AA"); // true
   * const meetsAAA = bgColor.meetsWCAG("#ffffff", "background", "AAA"); // false
   * ```
   */
  meetsWCAG = (
    comparisonColor: Contrastrast | string,
    role: "foreground" | "background",
    targetWcagLevel: WCAGContrastLevel,
    textSize: WCAGTextSize = "normal",
  ): boolean => {
    const ratio = this.textContrast(comparisonColor, role);
    const required = WCAG_LEVELS[targetWcagLevel][textSize];
    return ratio >= required;
  };

  /**
   * Check if this color is equal to another color (RGB values comparison)
   * @param color Color to compare against - accepts hex, rgb, hsl strings or Contrastrast instance
   * @returns True if both colors have identical RGB values
   * @example
   * ```typescript
   * const color1 = new Contrastrast("#ff0000");
   * const color2 = new Contrastrast("rgb(255, 0, 0)");
   * const color3 = new Contrastrast("hsl(0, 100%, 50%)");
   * console.log(color1.equals(color2)); // true
   * console.log(color1.equals(color3)); // true
   * ```
   */
  equals = (color: Contrastrast | string): boolean => {
    const other = color instanceof Contrastrast
      ? color
      : new Contrastrast(color);
    return (
      this.rgb.r === other.rgb.r &&
      this.rgb.g === other.rgb.g &&
      this.rgb.b === other.rgb.b
    );
  };
}
