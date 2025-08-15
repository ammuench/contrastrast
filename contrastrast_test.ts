import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { Contrastrast } from "./contrastrast.ts";
import { CONTRAST_THRESHOLD, WCAG_LEVELS } from "./constants.ts";
import type { ContrastResult } from "./utils/textContrast.ts";
import { referenceColors } from "./constants/reference-colors.ts";

describe("# Contrastrast", () => {
  describe("## Constructor and Factory Methods", () => {
    it("constructor parses HEX color strings", () => {
      const color = new Contrastrast(referenceColors.red.hex.colorString);
      expect(color.toRgb()).toEqual({
        r: referenceColors.red.rgb.r,
        g: referenceColors.red.rgb.g,
        b: referenceColors.red.rgb.b,
      });
    });

    it("constructor parses RGB color strings", () => {
      const color = new Contrastrast(referenceColors.red.rgb.colorString);
      expect(color.toRgb()).toEqual({
        r: referenceColors.red.rgb.r,
        g: referenceColors.red.rgb.g,
        b: referenceColors.red.rgb.b,
      });
    });

    it("constructor parses HSL color strings", () => {
      const color = new Contrastrast(referenceColors.red.hsl.colorString);
      expect(color.toRgb()).toEqual({
        r: referenceColors.red.rgb.r,
        g: referenceColors.red.rgb.g,
        b: referenceColors.red.rgb.b,
      });
    });

    it("fromHex creates instance from hex string", () => {
      const color = Contrastrast.fromHex(referenceColors.red.hex.colorString);
      expect(color.toRgb()).toEqual({
        r: referenceColors.red.rgb.r,
        g: referenceColors.red.rgb.g,
        b: referenceColors.red.rgb.b,
      });
    });

    it("fromHex handles hex without hash", () => {
      const color = Contrastrast.fromHex("ff0000");
      expect(color.toRgb()).toEqual({
        r: referenceColors.red.rgb.r,
        g: referenceColors.red.rgb.g,
        b: referenceColors.red.rgb.b,
      });
    });

    it("fromRgb creates instance from numbers", () => {
      const { r, g, b } = referenceColors.red.rgb;
      const color = Contrastrast.fromRgb(r, g, b);
      expect(color.toRgb()).toEqual({ r, g, b });
    });

    it("fromRgb creates instance from object", () => {
      const { r, g, b } = referenceColors.red.rgb;
      const color = Contrastrast.fromRgb({ r, g, b });
      expect(color.toRgb()).toEqual({ r, g, b });
    });

    it("fromHsl creates instance from numbers", () => {
      const color = Contrastrast.fromHsl(0, 100, 50);
      expect(color.toRgb()).toEqual({
        r: referenceColors.red.rgb.r,
        g: referenceColors.red.rgb.g,
        b: referenceColors.red.rgb.b,
      });
    });

    it("fromHsl creates instance from object", () => {
      const color = Contrastrast.fromHsl({ h: 0, s: 100, l: 50 });
      expect(color.toRgb()).toEqual({
        r: referenceColors.red.rgb.r,
        g: referenceColors.red.rgb.g,
        b: referenceColors.red.rgb.b,
      });
    });

    it("parse method works like constructor", () => {
      const color = Contrastrast.parse(referenceColors.red.hex.colorString);
      expect(color.toRgb()).toEqual({
        r: referenceColors.red.rgb.r,
        g: referenceColors.red.rgb.g,
        b: referenceColors.red.rgb.b,
      });
    });
  });

  describe("## Conversion Methods", () => {
    const redColor = new Contrastrast(referenceColors.red.hex.colorString);

    it("toHex returns hex string with hash by default", () => {
      expect(redColor.toHex()).toBe(referenceColors.red.hex.colorString);
    });

    it("toHex returns hex string without hash when requested", () => {
      expect(redColor.toHex(false)).toBe("ff0000");
    });

    it("toRgb returns RGB object", () => {
      const { r, g, b } = referenceColors.red.rgb;
      expect(redColor.toRgb()).toEqual({ r, g, b });
    });

    it("toRgbString returns RGB string", () => {
      expect(redColor.toRgbString()).toBe(referenceColors.red.rgb.colorString);
    });

    it("toHsl returns HSL object", () => {
      expect(redColor.toHsl()).toEqual({ h: 0, s: 100, l: 50 });
    });

    it("toHslString returns HSL string", () => {
      expect(redColor.toHslString()).toBe("hsl(0, 100%, 50%)");
    });

    it("round-trip conversion preserves color", () => {
      const original = referenceColors.goldenrod.hex.colorString;
      const color = new Contrastrast(original);
      const roundTrip = color.toHex();
      expect(roundTrip).toBe(original);
    });
  });

  describe("## Luminance and Brightness Calculations", () => {
    it("luminance calculates WCAG 2.1 relative luminance", () => {
      const black = new Contrastrast(referenceColors.black.hex.colorString);
      const white = new Contrastrast(referenceColors.white.hex.colorString);

      expect(black.luminance()).toBe(0);
      expect(white.luminance()).toBe(1);
    });

    it("brightness calculates legacy AERT brightness", () => {
      const black = new Contrastrast(referenceColors.black.hex.colorString);
      const white = new Contrastrast(referenceColors.white.hex.colorString);

      expect(black.brightness()).toBe(0);
      expect(white.brightness()).toBe(255);
    });

    it("midnight blue has expected luminance", () => {
      const midnightBlue = new Contrastrast(
        referenceColors.midnightBlue.hex.colorString,
      );
      // Expected luminance for midnight blue (#191970)
      expect(midnightBlue.luminance()).toBeCloseTo(0.0207, 3);
    });
  });

  describe("## Utility Methods", () => {
    it("isLight returns true for light colors", () => {
      const white = new Contrastrast(referenceColors.white.hex.colorString);
      const lightGray = new Contrastrast(
        referenceColors.lightGray.hex.colorString,
      );

      expect(white.isLight()).toBe(true);
      expect(lightGray.isLight()).toBe(true);
    });

    it("isLight returns false for dark colors", () => {
      const black = new Contrastrast(referenceColors.black.hex.colorString);
      const darkBlue = new Contrastrast(
        referenceColors.midnightBlue.hex.colorString,
      );

      expect(black.isLight()).toBe(false);
      expect(darkBlue.isLight()).toBe(false);
    });

    it("isDark is opposite of isLight", () => {
      const white = new Contrastrast(referenceColors.white.hex.colorString);
      const black = new Contrastrast(referenceColors.black.hex.colorString);

      expect(white.isDark()).toBe(!white.isLight());
      expect(black.isDark()).toBe(!black.isLight());
    });

    it("isLight uses brightness threshold", () => {
      // Create colors around the threshold
      // Use a balanced RGB that gets close to 124 brightness
      // (100 * 299 + 100 * 587 + 100 * 114) / 1000 = 100
      // Need to increase to get closer to 124
      const darkColor = Contrastrast.fromRgb(110, 110, 110); // ~110 brightness
      const lightColor = Contrastrast.fromRgb(130, 130, 130); // ~130 brightness

      expect(darkColor.brightness()).toBeLessThan(CONTRAST_THRESHOLD);
      expect(darkColor.isLight()).toBe(false);
      expect(lightColor.brightness()).toBeGreaterThan(CONTRAST_THRESHOLD);
      expect(lightColor.isLight()).toBe(true);
    });
  });

  describe("## Contrast Ratio Calculations", () => {
    it("contrastRatio method works with string input", () => {
      const black = new Contrastrast(referenceColors.black.hex.colorString);
      const ratio = black.contrastRatio(referenceColors.white.hex.colorString);
      expect(ratio).toBe(21);
    });

    it("contrastRatio method works with Contrastrast input", () => {
      const black = new Contrastrast(referenceColors.black.hex.colorString);
      const white = new Contrastrast(referenceColors.white.hex.colorString);
      const ratio = black.contrastRatio(white);
      expect(ratio).toBe(21);
    });

    it("contrastRatio is symmetric", () => {
      const color1 = new Contrastrast(
        referenceColors.midnightBlue.hex.colorString,
      );
      const color2 = new Contrastrast(referenceColors.white.hex.colorString);

      expect(color1.contrastRatio(color2)).toBe(color2.contrastRatio(color1));
    });
  });

  describe("## textContrast Instance Method", () => {
    const midnightBlue = new Contrastrast(
      referenceColors.midnightBlue.hex.colorString,
    );

    it("returns numeric ratio by default", () => {
      const ratio = midnightBlue.textContrast(
        referenceColors.white.hex.colorString,
      );
      expect(typeof ratio).toBe("number");
      expect(ratio).toBeCloseTo(14.85, 1);
    });

    it("role parameter defaults to 'background'", () => {
      const ratioDefault = midnightBlue.textContrast(
        referenceColors.white.hex.colorString,
      );
      const ratioExplicit = midnightBlue.textContrast(
        referenceColors.white.hex.colorString,
        "background",
      );
      expect(ratioDefault).toBe(ratioExplicit);
    });

    it("handles 'foreground' role correctly", () => {
      // When this color is foreground, white is background
      const ratio = midnightBlue.textContrast(
        referenceColors.white.hex.colorString,
        "foreground",
      );
      expect(ratio).toBeCloseTo(14.85, 1);
    });

    it("accepts Contrastrast instance as input", () => {
      const white = new Contrastrast(referenceColors.white.hex.colorString);
      const ratio = midnightBlue.textContrast(white);
      expect(ratio).toBeCloseTo(14.85, 1);
    });

    it("returns detailed results with returnDetails: true", () => {
      const result = midnightBlue.textContrast(
        referenceColors.white.hex.colorString,
        "background",
        { returnDetails: true },
      ) as ContrastResult;

      expect(result.ratio).toBeCloseTo(14.85, 1);
      expect(result.passes.AA_NORMAL).toBe(true);
      expect(result.passes.AA_LARGE).toBe(true);
      expect(result.passes.AAA_NORMAL).toBe(true);
      expect(result.passes.AAA_LARGE).toBe(true);
    });

    it("detailed results show failing combinations", () => {
      const lightGray = new Contrastrast(
        referenceColors.lightGray.hex.colorString,
      );
      const result = lightGray.textContrast(
        referenceColors.white.hex.colorString,
        "background",
        { returnDetails: true },
      ) as ContrastResult;

      expect(result.ratio).toBeCloseTo(1.61, 1);
      expect(result.passes.AA_NORMAL).toBe(false);
      expect(result.passes.AA_LARGE).toBe(false);
      expect(result.passes.AAA_NORMAL).toBe(false);
      expect(result.passes.AAA_LARGE).toBe(false);
    });
  });

  describe("## WCAG Compliance Helper", () => {
    const midnightBlue = new Contrastrast(
      referenceColors.midnightBlue.hex.colorString,
    );
    const whiteColor = referenceColors.white.hex.colorString;

    it("meetsWCAG returns true for compliant combinations", () => {
      expect(midnightBlue.meetsWCAG(whiteColor, "background", "AA", "normal"))
        .toBe(true);
      expect(midnightBlue.meetsWCAG(whiteColor, "background", "AA", "large"))
        .toBe(true);
      expect(midnightBlue.meetsWCAG(whiteColor, "background", "AAA", "normal"))
        .toBe(true);
      expect(midnightBlue.meetsWCAG(whiteColor, "background", "AAA", "large"))
        .toBe(true);
    });

    it("meetsWCAG returns false for non-compliant combinations", () => {
      const lightGray = new Contrastrast(
        referenceColors.lightGray.hex.colorString,
      );

      expect(lightGray.meetsWCAG(whiteColor, "background", "AA", "normal"))
        .toBe(false);
      expect(lightGray.meetsWCAG(whiteColor, "background", "AA", "large")).toBe(
        false,
      );
    });

    it("meetsWCAG defaults to normal text size", () => {
      const resultWithDefault = midnightBlue.meetsWCAG(
        whiteColor,
        "background",
        "AA",
      );
      const resultExplicit = midnightBlue.meetsWCAG(
        whiteColor,
        "background",
        "AA",
        "normal",
      );
      expect(resultWithDefault).toBe(resultExplicit);
    });

    it("meetsWCAG uses correct thresholds", () => {
      // Use medium gray which should be close to AA normal threshold (4.5)
      const mediumGray = new Contrastrast(
        referenceColors.mediumGray.hex.colorString,
      );

      const ratio = mediumGray.contrastRatio(whiteColor);
      const meetsAA = ratio >= WCAG_LEVELS.AA.normal;

      expect(mediumGray.meetsWCAG(whiteColor, "background", "AA", "normal"))
        .toBe(meetsAA);
    });
  });

  describe("## Color Equality", () => {
    it("equals returns true for identical colors", () => {
      const color1 = new Contrastrast(referenceColors.red.hex.colorString);
      const color2 = new Contrastrast(referenceColors.red.hex.colorString);
      expect(color1.equals(color2)).toBe(true);
    });

    it("equals returns true for equivalent colors in different formats", () => {
      const hexColor = new Contrastrast(referenceColors.red.hex.colorString);
      const rgbColor = new Contrastrast(referenceColors.red.rgb.colorString);
      expect(hexColor.equals(rgbColor)).toBe(true);
    });

    it("equals works with string input", () => {
      const color = new Contrastrast(referenceColors.red.hex.colorString);
      expect(color.equals(referenceColors.red.hex.colorString)).toBe(true);
      expect(color.equals(referenceColors.red.rgb.colorString)).toBe(true);
    });

    it("equals returns false for different colors", () => {
      const red = new Contrastrast(referenceColors.red.hex.colorString);
      const midnightBlue = new Contrastrast(
        referenceColors.midnightBlue.hex.colorString,
      );
      expect(red.equals(midnightBlue)).toBe(false);
    });
  });

  describe("## Integration Tests", () => {
    it("complex workflow with multiple operations", () => {
      // Create a brand color and analyze its accessibility
      const brandColor = new Contrastrast(
        referenceColors.midnightBlue.hex.colorString,
      );

      // Check if it works well with white text
      const whiteTextRatio = brandColor.textContrast(
        referenceColors.white.hex.colorString,
        "background",
      );
      expect(whiteTextRatio).toBeGreaterThanOrEqual(4.5);

      // Verify WCAG compliance
      expect(
        brandColor.meetsWCAG(
          referenceColors.white.hex.colorString,
          "background",
          "AA",
        ),
      ).toBe(true);

      // Check luminance properties
      expect(brandColor.isDark()).toBe(true);
      expect(brandColor.luminance()).toBeLessThan(0.5);
    });

    it("ensures consistency across different color formats", () => {
      const goldenrod = referenceColors.goldenrod;

      const color1 = new Contrastrast(goldenrod.hex.colorString);
      const color2 = new Contrastrast(goldenrod.rgb.colorString);
      const color3 = new Contrastrast(goldenrod.hsl.colorString);

      // All should have very similar RGB values (within rounding)
      const rgb1 = color1.toRgb();
      const rgb2 = color2.toRgb();
      const rgb3 = color3.toRgb();

      expect(Math.abs(rgb1.r - rgb2.r)).toBeLessThanOrEqual(1);
      expect(Math.abs(rgb1.g - rgb2.g)).toBeLessThanOrEqual(1);
      expect(Math.abs(rgb1.b - rgb2.b)).toBeLessThanOrEqual(1);

      expect(Math.abs(rgb1.r - rgb3.r)).toBeLessThanOrEqual(2);
      expect(Math.abs(rgb1.g - rgb3.g)).toBeLessThanOrEqual(2);
      expect(Math.abs(rgb1.b - rgb3.b)).toBeLessThanOrEqual(2);
    });

    it("validates immutability of instances", () => {
      const original = new Contrastrast(
        referenceColors.midnightBlue.hex.colorString,
      );
      const originalRgb = original.toRgb();

      // Calling methods should not modify the original
      original.toHex();
      original.toHsl();
      original.textContrast(referenceColors.white.hex.colorString);
      original.contrastRatio(referenceColors.black.hex.colorString);
      original.equals(referenceColors.midnightBlue.hex.colorString);

      // RGB values should remain unchanged
      expect(original.toRgb()).toEqual(originalRgb);
    });
  });
});
