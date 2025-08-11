import type { RGBValues } from "./types/RGB.types.ts";
import type {
  ContrastOptions,
  ContrastResult,
  HSLValues,
  TextSize,
  WCAGLevel,
} from "./types/ContrastTypes.ts";
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
import { textContrast } from "./utils/textContrast.ts";

export class Contrastrast {
  private readonly rgb: RGBValues;

  constructor(colorString: string) {
    this.rgb = getRGBFromColorString(colorString);
  }

  // Factory Methods
  static fromHex = (hex: string): Contrastrast => {
    const normalizedHex = hex.startsWith("#") ? hex : `#${hex}`;
    return new Contrastrast(normalizedHex);
  };

  static fromRgb(r: number, g: number, b: number): Contrastrast;
  static fromRgb(rgb: RGBValues): Contrastrast;
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

  static fromHsl(h: number, s: number, l: number): Contrastrast;
  static fromHsl(hsl: HSLValues): Contrastrast;
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

  static parse = (colorString: string): Contrastrast =>
    new Contrastrast(colorString);

  // Conversion Methods
  toHex = (includeHash: boolean = true): string => {
    const toHex = (n: number) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    const hexValue = toHex(this.rgb.r) + toHex(this.rgb.g) + toHex(this.rgb.b);
    return includeHash ? `#${hexValue}` : hexValue;
  };

  toRgb = (): RGBValues => ({ ...this.rgb });

  toRgbString = (): string =>
    `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`;

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

  toHslString = (): string => {
    const hsl = this.toHsl();
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  };

  // WCAG 2.1 luminance calculation
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

  brightness = (): number =>
    (this.rgb.r * BRIGHTNESS_COEFFICIENTS.RED +
      this.rgb.g * BRIGHTNESS_COEFFICIENTS.GREEN +
      this.rgb.b * BRIGHTNESS_COEFFICIENTS.BLUE) /
    BRIGHTNESS_COEFFICIENTS.DIVISOR;

  /* Utility Methods */
  isLight = (): boolean => this.brightness() > CONTRAST_THRESHOLD;

  isDark = (): boolean => !this.isLight();

  contrastRatio = (color: Contrastrast | string): number =>
    contrastRatio(this, color);

  textContrast = (
    otherColor: Contrastrast | string,
    role: "foreground" | "background" = "background",
    options: ContrastOptions = {},
  ): number | ContrastResult => {
    if (role === "background") {
      // Current color is background, otherColor is foreground
      return textContrast(otherColor, this, options);
    } else {
      // Current color is foreground, otherColor is background
      return textContrast(this, otherColor, options);
    }
  };

  // WCAG Compliance Helper
  meetsWCAG = (
    otherColor: Contrastrast | string,
    role: "foreground" | "background",
    level: WCAGLevel,
    textSize: TextSize = "normal",
  ): boolean => {
    const ratio = this.textContrast(otherColor, role);
    const required = WCAG_LEVELS[level][textSize];
    return (typeof ratio === "number" ? ratio : ratio.ratio) >= required;
  };

  // Utility Methods
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
