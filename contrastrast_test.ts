import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { Contrastrast } from "./contrastrast.ts";
import { CONTRAST_THRESHOLD } from "./constants.ts";
import type { ContrastResult } from "./utils/textContrast.ts";
import { REFERENCE_COLORS } from "./reference-values/reference-colors.ts";
import { WCAG_CONTRAST_REFERENCE } from "./reference-values/wcag-reference-colors.ts";

describe("# Contrastrast", () => {
  describe("## Color parsing", () => {
    describe("### HEX parsing", () => {
      it("constructor parsing preserves HEX values", () => {
        const originalHex = REFERENCE_COLORS.lightGray.hex.colorString;
        const color = new Contrastrast(originalHex);
        expect(color.toHex()).toBe(originalHex);
      });

      it("fromHex factory method preserves HEX values", () => {
        const originalHex = REFERENCE_COLORS.midnightBlue.hex.colorString;
        const color = Contrastrast.fromHex(originalHex);
        expect(color.toHex()).toBe(originalHex);
      });

      it("fromHex handles hex without hash", () => {
        const color = Contrastrast.fromHex("ff0000");
        expect(color.toHex()).toBe("#ff0000");
      });

      it("multiple HEX colors round-trip correctly", () => {
        const testColors = [
          REFERENCE_COLORS.black,
          REFERENCE_COLORS.white,
          REFERENCE_COLORS.red,
          REFERENCE_COLORS.lightGray,
          REFERENCE_COLORS.mediumGray,
          REFERENCE_COLORS.goldenrod,
          REFERENCE_COLORS.midnightBlue,
        ];

        testColors.forEach((refColor) => {
          const hexColor = new Contrastrast(refColor.hex.colorString);
          expect(hexColor.toHex()).toBe(refColor.hex.colorString);
        });
      });
    });

    describe("### RGB parsing", () => {
      it("constructor parsing preserves RGB values", () => {
        const originalRgb = REFERENCE_COLORS.lightGray.rgb;
        const color = new Contrastrast(originalRgb.colorString);
        expect(color.toRgb()).toEqual({
          r: originalRgb.r,
          g: originalRgb.g,
          b: originalRgb.b,
        });
      });

      it("fromRgb factory method preserves RGB values", () => {
        const originalRgb = REFERENCE_COLORS.goldenrod.rgb;
        const color = Contrastrast.fromRgb(
          originalRgb.r,
          originalRgb.g,
          originalRgb.b,
        );
        expect(color.toRgb()).toEqual({
          r: originalRgb.r,
          g: originalRgb.g,
          b: originalRgb.b,
        });
      });

      it("fromRgb with object preserves RGB values", () => {
        const originalRgb = REFERENCE_COLORS.goldenrod.rgb;
        const color = Contrastrast.fromRgb({
          r: originalRgb.r,
          g: originalRgb.g,
          b: originalRgb.b,
        });
        expect(color.toRgb()).toEqual({
          r: originalRgb.r,
          g: originalRgb.g,
          b: originalRgb.b,
        });
      });

      it("multiple RGB colors round-trip correctly", () => {
        const testColors = [
          REFERENCE_COLORS.black,
          REFERENCE_COLORS.white,
          REFERENCE_COLORS.red,
          REFERENCE_COLORS.lightGray,
          REFERENCE_COLORS.mediumGray,
          REFERENCE_COLORS.goldenrod,
          REFERENCE_COLORS.midnightBlue,
        ];

        testColors.forEach((refColor) => {
          const rgbColor = new Contrastrast(refColor.rgb.colorString);
          expect(rgbColor.toRgb()).toEqual({
            r: refColor.rgb.r,
            g: refColor.rgb.g,
            b: refColor.rgb.b,
          });
        });
      });
    });

    describe("### HSL parsing", () => {
      it("constructor parsing preserves HSL values", () => {
        const originalHsl = REFERENCE_COLORS.lightGray.hsl;
        const color = new Contrastrast(originalHsl.colorString);
        const parsedHsl = color.toHsl();
        expect(parsedHsl).toEqual({
          h: parseInt(originalHsl.h),
          s: parseInt(originalHsl.s),
          l: parseInt(originalHsl.l),
        });
      });

      it("fromHsl factory method preserves HSL values", () => {
        const originalHsl = REFERENCE_COLORS.mediumGray.hsl;
        const color = Contrastrast.fromHsl(
          parseInt(originalHsl.h),
          parseInt(originalHsl.s),
          parseInt(originalHsl.l),
        );
        const parsedHsl = color.toHsl();
        expect(parsedHsl).toEqual({
          h: parseInt(originalHsl.h),
          s: parseInt(originalHsl.s),
          l: parseInt(originalHsl.l),
        });
      });

      it("fromHsl with object preserves HSL values", () => {
        const originalHsl = REFERENCE_COLORS.mediumGray.hsl;
        const color = Contrastrast.fromHsl({
          h: parseInt(originalHsl.h),
          s: parseInt(originalHsl.s),
          l: parseInt(originalHsl.l),
        });
        const parsedHsl = color.toHsl();
        expect(parsedHsl).toEqual({
          h: parseInt(originalHsl.h),
          s: parseInt(originalHsl.s),
          l: parseInt(originalHsl.l),
        });
      });

      it("multiple HSL colors round-trip correctly", () => {
        const testColors = [
          REFERENCE_COLORS.black,
          REFERENCE_COLORS.white,
          REFERENCE_COLORS.red,
          REFERENCE_COLORS.lightGray,
          REFERENCE_COLORS.mediumGray,
          REFERENCE_COLORS.goldenrod,
          REFERENCE_COLORS.midnightBlue,
        ];

        testColors.forEach((refColor) => {
          const hslColor = new Contrastrast(refColor.hsl.colorString);
          const parsedHsl = hslColor.toHsl();
          expect(parsedHsl).toEqual({
            h: parseInt(refColor.hsl.h),
            s: parseInt(refColor.hsl.s),
            l: parseInt(refColor.hsl.l),
          });
        });
      });
    });

    describe("### General parsing", () => {
      it("parse method works like constructor", () => {
        const originalHex = REFERENCE_COLORS.red.hex.colorString;
        const color = Contrastrast.parse(originalHex);
        expect(color.toHex()).toBe(originalHex);
      });
    });

    describe("### ParseOptions configuration", () => {
      describe("#### throwOnError behavior", () => {
        it("constructor throws by default on invalid color string", () => {
          expect(() => new Contrastrast("invalid-color")).toThrow(
            'Invalid color string "invalid-color"',
          );
        });

        it("constructor throws when throwOnError is explicitly true", () => {
          expect(() =>
            new Contrastrast("invalid-color", { throwOnError: true })
          ).toThrow('Invalid color string "invalid-color"');
        });

        it("constructor does not throw when throwOnError is false", () => {
          expect(() =>
            new Contrastrast("invalid-color", { throwOnError: false })
          ).not.toThrow();
        });

        it("static parse throws by default on invalid color string", () => {
          expect(() => Contrastrast.parse("invalid-color")).toThrow(
            'Invalid color string "invalid-color"',
          );
        });

        it("static parse throws when throwOnError is explicitly true", () => {
          expect(() =>
            Contrastrast.parse("invalid-color", { throwOnError: true })
          ).toThrow('Invalid color string "invalid-color"');
        });

        it("static parse does not throw when throwOnError is false", () => {
          expect(() =>
            Contrastrast.parse("invalid-color", { throwOnError: false })
          ).not.toThrow();
        });
      });

      describe("#### fallbackColor behavior", () => {
        it("constructor uses default fallback color (#000000) when throwOnError is false", () => {
          const color = new Contrastrast("invalid-color", {
            throwOnError: false,
          });
          expect(color.toHex()).toBe("#000000");
          expect(color.toRgb()).toEqual({ r: 0, g: 0, b: 0 });
        });

        it("constructor uses custom fallbackColor when provided", () => {
          const fallbackColor = "#ff0000";
          const color = new Contrastrast("invalid-color", {
            throwOnError: false,
            fallbackColor,
          });
          expect(color.toHex()).toBe(fallbackColor);
          expect(color.toRgb()).toEqual({ r: 255, g: 0, b: 0 });
        });

        it("static parse uses default fallback color when throwOnError is false", () => {
          const color = Contrastrast.parse("invalid-color", {
            throwOnError: false,
          });
          expect(color.toHex()).toBe("#000000");
          expect(color.toRgb()).toEqual({ r: 0, g: 0, b: 0 });
        });

        it("static parse uses custom fallbackColor when provided", () => {
          const fallbackColor = "#00ff00";
          const color = Contrastrast.parse("invalid-color", {
            throwOnError: false,
            fallbackColor,
          });
          expect(color.toHex()).toBe(fallbackColor);
          expect(color.toRgb()).toEqual({ r: 0, g: 255, b: 0 });
        });

        it("fallbackColor works with RGB format", () => {
          const fallbackColor = "rgb(128, 128, 128)";
          const color = new Contrastrast("not-a-color", {
            throwOnError: false,
            fallbackColor,
          });
          expect(color.toRgb()).toEqual({ r: 128, g: 128, b: 128 });
        });

        it("fallbackColor works with HSL format", () => {
          const fallbackColor = "hsl(120, 100%, 50%)"; // Pure green
          const color = Contrastrast.parse("gibberish", {
            throwOnError: false,
            fallbackColor,
          });
          expect(color.toRgb()).toEqual({ r: 0, g: 255, b: 0 });
        });

        it("invalid fallbackColor throws error even when throwOnError is false", () => {
          expect(() =>
            new Contrastrast("invalid-color", {
              throwOnError: false,
              fallbackColor: "not-a-valid-color",
            })
          ).toThrow();
          expect(() =>
            Contrastrast.parse("invalid-color", {
              throwOnError: false,
              fallbackColor: "also-invalid",
            })
          ).toThrow();
        });
      });

      describe("#### Edge cases and validation", () => {
        it("throwOnError false with undefined fallbackColor uses default", () => {
          const color = new Contrastrast("invalid", {
            throwOnError: false,
            fallbackColor: undefined,
          });
          expect(color.toHex()).toBe("#000000");
        });

        it("valid color string ignores ParseOptions", () => {
          const validColor = "#ff0000";
          const color1 = new Contrastrast(validColor);
          const color2 = new Contrastrast(validColor, {
            throwOnError: false,
            fallbackColor: "#00ff00",
          });

          expect(color1.equals(color2)).toBe(true);
          expect(color2.toHex()).toBe(validColor);
        });

        it("constructor with empty parseOpts object behaves like defaults", () => {
          expect(() => new Contrastrast("invalid", {})).toThrow(
            'Invalid color string "invalid"',
          );
        });

        it("parseOpts as undefined behaves like defaults", () => {
          expect(() => new Contrastrast("invalid", undefined)).toThrow(
            'Invalid color string "invalid"',
          );
        });

        it("partially filled parseOpts works correctly", () => {
          const color = new Contrastrast("invalid", { throwOnError: false }); // No fallbackColor specified
          expect(color.toHex()).toBe("#000000"); // Should use default fallback
        });
      });
    });
  });

  describe("## Conversion Methods", () => {
    const redColor = new Contrastrast(REFERENCE_COLORS.red.hex.colorString);

    it("toHex returns hex string with hash by default", () => {
      expect(redColor.toHex()).toBe(REFERENCE_COLORS.red.hex.colorString);
    });

    it("toHex returns hex string without hash when requested", () => {
      expect(redColor.toHex(false)).toBe("ff0000");
    });

    it("toRgb returns RGB object", () => {
      const { r, g, b } = REFERENCE_COLORS.red.rgb;
      expect(redColor.toRgb()).toEqual({ r, g, b });
    });

    it("toRgbString returns RGB string", () => {
      expect(redColor.toRgbString()).toBe(REFERENCE_COLORS.red.rgb.colorString);
    });

    it("toHsl returns HSL object", () => {
      expect(redColor.toHsl()).toEqual({ h: 0, s: 100, l: 50 });
    });

    it("toHslString returns HSL string", () => {
      expect(redColor.toHslString()).toBe("hsl(0, 100%, 50%)");
    });

    it("round-trip conversion preserves color", () => {
      const original = REFERENCE_COLORS.goldenrod.hex.colorString;
      const color = new Contrastrast(original);
      const roundTrip = color.toHex();
      expect(roundTrip).toBe(original);
    });
  });

  describe("## Luminance and Brightness Calculations", () => {
    it("luminance calculates WCAG 2.1 relative luminance", () => {
      const black = new Contrastrast(REFERENCE_COLORS.black.hex.colorString);
      const white = new Contrastrast(REFERENCE_COLORS.white.hex.colorString);

      expect(black.luminance()).toBe(0);
      expect(white.luminance()).toBe(1);
    });

    it("brightness calculates legacy AERT brightness", () => {
      const black = new Contrastrast(REFERENCE_COLORS.black.hex.colorString);
      const white = new Contrastrast(REFERENCE_COLORS.white.hex.colorString);

      expect(black.brightness()).toBe(0);
      expect(white.brightness()).toBe(255);
    });

    it("midnight blue has expected luminance", () => {
      const midnightBlue = new Contrastrast(
        REFERENCE_COLORS.midnightBlue.hex.colorString,
      );
      // Expected luminance for midnight blue (#191970)
      expect(midnightBlue.luminance()).toBeCloseTo(0.0207, 3);
    });
  });

  describe("## Utility Methods", () => {
    it("isLight returns true for light colors", () => {
      const white = new Contrastrast(REFERENCE_COLORS.white.hex.colorString);
      const lightGray = new Contrastrast(
        REFERENCE_COLORS.lightGray.hex.colorString,
      );

      expect(white.isLight()).toBe(true);
      expect(lightGray.isLight()).toBe(true);
    });

    it("isLight returns false for dark colors", () => {
      const black = new Contrastrast(REFERENCE_COLORS.black.hex.colorString);
      const darkBlue = new Contrastrast(
        REFERENCE_COLORS.midnightBlue.hex.colorString,
      );

      expect(black.isLight()).toBe(false);
      expect(darkBlue.isLight()).toBe(false);
    });

    it("isDark is opposite of isLight", () => {
      const white = new Contrastrast(REFERENCE_COLORS.white.hex.colorString);
      const black = new Contrastrast(REFERENCE_COLORS.black.hex.colorString);

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
      const black = new Contrastrast(REFERENCE_COLORS.black.hex.colorString);
      const ratio = black.contrastRatio(REFERENCE_COLORS.white.hex.colorString);
      expect(ratio).toBe(21);
    });

    it("contrastRatio method works with Contrastrast input", () => {
      const black = new Contrastrast(REFERENCE_COLORS.black.hex.colorString);
      const white = new Contrastrast(REFERENCE_COLORS.white.hex.colorString);
      const ratio = black.contrastRatio(white);
      expect(ratio).toBe(21);
    });

    it("contrastRatio is symmetric", () => {
      const color1 = new Contrastrast(
        REFERENCE_COLORS.midnightBlue.hex.colorString,
      );
      const color2 = new Contrastrast(REFERENCE_COLORS.white.hex.colorString);

      expect(color1.contrastRatio(color2)).toBe(color2.contrastRatio(color1));
    });
  });

  describe("## textContrast Instance Method", () => {
    const midnightBlue = new Contrastrast(
      REFERENCE_COLORS.midnightBlue.hex.colorString,
    );

    it("returns numeric ratio by default", () => {
      const ratio = midnightBlue.textContrast(
        REFERENCE_COLORS.white.hex.colorString,
      );
      expect(typeof ratio).toBe("number");
      expect(ratio).toBeCloseTo(14.85, 1);
    });

    it("role parameter defaults to 'background'", () => {
      const ratioDefault = midnightBlue.textContrast(
        REFERENCE_COLORS.white.hex.colorString,
      );
      const ratioExplicit = midnightBlue.textContrast(
        REFERENCE_COLORS.white.hex.colorString,
        "background",
      );
      expect(ratioDefault).toBe(ratioExplicit);
    });

    it("handles 'foreground' role correctly", () => {
      // When this color is foreground, white is background
      const ratio = midnightBlue.textContrast(
        REFERENCE_COLORS.white.hex.colorString,
        "foreground",
      );
      expect(ratio).toBeCloseTo(14.85, 1);
    });

    it("accepts Contrastrast instance as input", () => {
      const white = new Contrastrast(REFERENCE_COLORS.white.hex.colorString);
      const ratio = midnightBlue.textContrast(white);
      expect(ratio).toBeCloseTo(14.85, 1);
    });

    it("returns detailed results with returnDetails: true", () => {
      const result = midnightBlue.textContrast(
        REFERENCE_COLORS.white.hex.colorString,
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
      const testData = WCAG_CONTRAST_REFERENCE.lightGrayWhite;
      const color = new Contrastrast(testData.foreground);
      const result = color.textContrast(testData.background, "foreground", {
        returnDetails: true,
      }) as ContrastResult;

      expect(result.ratio).toBeCloseTo(testData.expectedContrastRatio, 1);
      expect(result.passes.AA_NORMAL).toBe(
        testData.expectedWCAGResults.AA_NORMAL,
      );
      expect(result.passes.AA_LARGE).toBe(
        testData.expectedWCAGResults.AA_LARGE,
      );
      expect(result.passes.AAA_NORMAL).toBe(
        testData.expectedWCAGResults.AAA_NORMAL,
      );
      expect(result.passes.AAA_LARGE).toBe(
        testData.expectedWCAGResults.AAA_LARGE,
      );
    });
  });

  describe("## WCAG Compliance Helper", () => {
    // Test all WCAG combinations using reference data
    Object.entries(WCAG_CONTRAST_REFERENCE).forEach(([_testName, testData]) => {
      it(`meetsWCAG ${testData.testCondition} (${testData.expectedContrastRatio}:1)`, () => {
        const color = new Contrastrast(testData.foreground);

        expect(
          color.meetsWCAG(testData.background, "foreground", "AA", "normal"),
        ).toBe(testData.expectedWCAGResults.AA_NORMAL);
        expect(
          color.meetsWCAG(testData.background, "foreground", "AA", "large"),
        ).toBe(testData.expectedWCAGResults.AA_LARGE);
        expect(
          color.meetsWCAG(testData.background, "foreground", "AAA", "normal"),
        ).toBe(testData.expectedWCAGResults.AAA_NORMAL);
        expect(
          color.meetsWCAG(testData.background, "foreground", "AAA", "large"),
        ).toBe(testData.expectedWCAGResults.AAA_LARGE);
      });
    });

    it("meetsWCAG defaults to normal text size", () => {
      const testData = WCAG_CONTRAST_REFERENCE.aaaNormalBorderline;
      const color = new Contrastrast(testData.foreground);
      const resultWithDefault = color.meetsWCAG(
        testData.background,
        "foreground",
        "AAA",
      );
      const resultExplicit = color.meetsWCAG(
        testData.background,
        "foreground",
        "AAA",
        "normal",
      );
      expect(resultWithDefault).toBe(resultExplicit);
      expect(resultWithDefault).toBe(testData.expectedWCAGResults.AAA_NORMAL);
    });
  });

  describe("## Color Equality", () => {
    it("equals returns true for identical colors", () => {
      const color1 = new Contrastrast(REFERENCE_COLORS.red.hex.colorString);
      const color2 = new Contrastrast(REFERENCE_COLORS.red.hex.colorString);
      expect(color1.equals(color2)).toBe(true);
    });

    it("equals returns true for equivalent colors in different formats", () => {
      const hexColor = new Contrastrast(REFERENCE_COLORS.red.hex.colorString);
      const rgbColor = new Contrastrast(REFERENCE_COLORS.red.rgb.colorString);
      expect(hexColor.equals(rgbColor)).toBe(true);
    });

    it("equals works with string input", () => {
      const color = new Contrastrast(REFERENCE_COLORS.red.hex.colorString);
      expect(color.equals(REFERENCE_COLORS.red.hex.colorString)).toBe(true);
      expect(color.equals(REFERENCE_COLORS.red.rgb.colorString)).toBe(true);
    });

    it("equals returns false for different colors", () => {
      const red = new Contrastrast(REFERENCE_COLORS.red.hex.colorString);
      const midnightBlue = new Contrastrast(
        REFERENCE_COLORS.midnightBlue.hex.colorString,
      );
      expect(red.equals(midnightBlue)).toBe(false);
    });
  });

  describe("## Integration Tests", () => {
    it("complex workflow with multiple operations", () => {
      // Create a brand color and analyze its accessibility
      const brandColor = new Contrastrast(
        REFERENCE_COLORS.midnightBlue.hex.colorString,
      );

      // Check if it works well with white text
      const whiteTextRatio = brandColor.textContrast(
        REFERENCE_COLORS.white.hex.colorString,
        "background",
      );
      expect(whiteTextRatio).toBeGreaterThanOrEqual(4.5);

      // Verify WCAG compliance
      expect(
        brandColor.meetsWCAG(
          REFERENCE_COLORS.white.hex.colorString,
          "background",
          "AA",
        ),
      ).toBe(true);

      // Check luminance properties
      expect(brandColor.isDark()).toBe(true);
      expect(brandColor.luminance()).toBeLessThan(0.5);
    });

    it("ensures consistency across different color formats", () => {
      const goldenrod = REFERENCE_COLORS.goldenrod;

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
        REFERENCE_COLORS.midnightBlue.hex.colorString,
      );
      const originalRgb = original.toRgb();

      // Calling methods should not modify the original
      original.toHex();
      original.toHsl();
      original.textContrast(REFERENCE_COLORS.white.hex.colorString);
      original.contrastRatio(REFERENCE_COLORS.black.hex.colorString);
      original.equals(REFERENCE_COLORS.midnightBlue.hex.colorString);

      // RGB values should remain unchanged
      expect(original.toRgb()).toEqual(originalRgb);
    });
  });

  describe("## Inverse Conditions", () => {
    describe("### Precision & Edge Cases", () => {
      it("very similar but different colors are distinguished", () => {
        // Test colors that are close but not identical
        const color1 = new Contrastrast("#ffffff"); // Pure white
        const color2 = new Contrastrast("#fefefe"); // Almost white

        expect(color1.toHex()).not.toBe(color2.toHex());
        expect(color1.toRgb()).not.toEqual(color2.toRgb());
        expect(color1.equals(color2)).toBe(false);
      });

      it("cross-format parsing maintains color differences", () => {
        // Parse same color in different formats
        const redHex = new Contrastrast(REFERENCE_COLORS.red.hex.colorString);
        const redRgb = new Contrastrast(REFERENCE_COLORS.red.rgb.colorString);
        const redHsl = new Contrastrast(REFERENCE_COLORS.red.hsl.colorString);

        // Parse different color in same format
        const blueHex = new Contrastrast(
          REFERENCE_COLORS.midnightBlue.hex.colorString,
        );

        // Same color in different formats should be equal
        expect(redHex.equals(redRgb)).toBe(true);
        expect(redRgb.equals(redHsl)).toBe(true);

        // Different colors should NOT be equal regardless of format
        expect(redHex.equals(blueHex)).toBe(false);
        expect(redRgb.equals(blueHex)).toBe(false);
        expect(redHsl.equals(blueHex)).toBe(false);
      });
    });

    describe("### Mathematical Properties", () => {
      it("isLight and isDark are always opposites", () => {
        const testColors = [
          new Contrastrast(REFERENCE_COLORS.black.hex.colorString),
          new Contrastrast(REFERENCE_COLORS.white.hex.colorString),
          new Contrastrast(REFERENCE_COLORS.red.hex.colorString),
          new Contrastrast(REFERENCE_COLORS.lightGray.hex.colorString),
          new Contrastrast(REFERENCE_COLORS.mediumGray.hex.colorString),
          new Contrastrast(REFERENCE_COLORS.goldenrod.hex.colorString),
          new Contrastrast(REFERENCE_COLORS.midnightBlue.hex.colorString),
        ];

        testColors.forEach((color) => {
          expect(color.isLight()).toBe(!color.isDark());
        });
      });

      it("equals is symmetric for all color pairs", () => {
        const colors = [
          new Contrastrast(REFERENCE_COLORS.red.hex.colorString),
          new Contrastrast(REFERENCE_COLORS.midnightBlue.hex.colorString),
          new Contrastrast(REFERENCE_COLORS.white.hex.colorString),
          new Contrastrast(REFERENCE_COLORS.black.hex.colorString),
        ];

        // Test all pairs - equals should be symmetric: a.equals(b) === b.equals(a)
        for (let i = 0; i < colors.length; i++) {
          for (let j = i; j < colors.length; j++) {
            const colorA = colors[i];
            const colorB = colors[j];
            expect(colorA.equals(colorB)).toBe(colorB.equals(colorA));
          }
        }
      });
    });

    describe("### Threshold & Boundary Testing", () => {
      it("brightness exactly at threshold (124) behaves consistently", () => {
        // Create a color with brightness exactly at threshold (124)
        // Using formula: (r * 299 + g * 587 + b * 114) / 1000 = 124
        // Solving: r=124, g=124, b=124 gives brightness = 124
        const thresholdColor = Contrastrast.fromRgb(124, 124, 124);

        expect(thresholdColor.brightness()).toBe(CONTRAST_THRESHOLD);
        // At exactly threshold, should NOT be light (uses > not >=)
        expect(thresholdColor.isLight()).toBe(false);
        expect(thresholdColor.isDark()).toBe(true);
      });

      it("WCAG levels maintain logical relationships", () => {
        // Test that AAA is stricter than AA, and Normal is stricter than Large
        const color = new Contrastrast("#ffffff");
        const mediumContrast = "#666666"; // Medium contrast color

        const AALarge = color.meetsWCAG(
          mediumContrast,
          "background",
          "AA",
          "large",
        );
        const AANormal = color.meetsWCAG(
          mediumContrast,
          "background",
          "AA",
          "normal",
        );
        const AAALarge = color.meetsWCAG(
          mediumContrast,
          "background",
          "AAA",
          "large",
        );
        const AAANormal = color.meetsWCAG(
          mediumContrast,
          "background",
          "AAA",
          "normal",
        );

        // Logical relationships that should always hold:
        // If AAA Normal passes, AAA Large should also pass
        if (AAANormal) expect(AAALarge).toBe(true);
        // If AAA Large passes, AA Large should also pass
        if (AAALarge) expect(AALarge).toBe(true);
        // If AA Normal passes, AA Large should also pass
        if (AANormal) expect(AALarge).toBe(true);
      });
    });

    describe("### Deterministic Behavior", () => {
      it("luminance values stay within valid range", () => {
        const testColors = [
          new Contrastrast(REFERENCE_COLORS.black.hex.colorString),
          new Contrastrast(REFERENCE_COLORS.white.hex.colorString),
          new Contrastrast(REFERENCE_COLORS.red.hex.colorString),
          new Contrastrast(REFERENCE_COLORS.midnightBlue.hex.colorString),
        ];

        testColors.forEach((color) => {
          const luminance = color.luminance();

          // Luminance must be between 0 and 1 (inclusive)
          expect(luminance).toBeGreaterThanOrEqual(0);
          expect(luminance).toBeLessThanOrEqual(1);

          // Multiple calls should return same value
          expect(color.luminance()).toBe(luminance);
        });
      });

      it("identical colors always fail WCAG tests", () => {
        const testData = WCAG_CONTRAST_REFERENCE.identicalColors;
        const color = new Contrastrast(testData.foreground);

        // Same color should always fail (contrast ratio = 1:1)
        expect(
          color.meetsWCAG(testData.background, "foreground", "AA", "normal"),
        ).toBe(testData.expectedWCAGResults.AA_NORMAL);
        expect(
          color.meetsWCAG(testData.background, "foreground", "AA", "large"),
        ).toBe(testData.expectedWCAGResults.AA_LARGE);
        expect(
          color.meetsWCAG(testData.background, "foreground", "AAA", "normal"),
        ).toBe(testData.expectedWCAGResults.AAA_NORMAL);
        expect(
          color.meetsWCAG(testData.background, "foreground", "AAA", "large"),
        ).toBe(testData.expectedWCAGResults.AAA_LARGE);
      });
    });
  });
});
