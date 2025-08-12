import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { textContrast } from "./textContrast.ts";
import { contrastRatio } from "./contrastRatio.ts";
import { Contrastrast } from "../contrastrast.ts";

describe("# textContrast", () => {
  describe("## basic contrast calculations", () => {
    it("returns numeric ratio by default", () => {
      const result = textContrast("#000000", "#ffffff");
      expect(typeof result).toBe("number");
      expect(result).toBeCloseTo(21, 1);
    });

    it("returns same value as contrastRatio utility", () => {
      const textResult = textContrast("#ff0000", "#ffffff");
      const ratioResult = contrastRatio("#ff0000", "#ffffff");
      expect(textResult).toBe(ratioResult);
    });

    it("handles order independence", () => {
      const result1 = textContrast("#000000", "#ffffff");
      const result2 = textContrast("#ffffff", "#000000");
      expect(result1).toBe(result2);
    });
  });

  describe("## detailed results", () => {
    it("returns detailed results when returnDetails is true", () => {
      const result = textContrast("#000000", "#ffffff", {
        returnDetails: true,
      });

      expect(typeof result).toBe("object");
      expect(result).toHaveProperty("ratio");
      expect(result).toHaveProperty("passes");
      expect(result.ratio).toBeCloseTo(21, 1);
    });

    it("includes all WCAG compliance checks in passes object", () => {
      const result = textContrast("#1a73e8", "#ffffff", {
        returnDetails: true,
      });

      expect(result.passes).toHaveProperty("AA_NORMAL");
      expect(result.passes).toHaveProperty("AA_LARGE");
      expect(result.passes).toHaveProperty("AAA_NORMAL");
      expect(result.passes).toHaveProperty("AAA_LARGE");
    });

    it("correctly identifies passing WCAG combinations", () => {
      // Black on white should pass all WCAG levels
      const result = textContrast("#000000", "#ffffff", {
        returnDetails: true,
      });

      expect(result.passes.AA_NORMAL).toBe(true);
      expect(result.passes.AA_LARGE).toBe(true);
      expect(result.passes.AAA_NORMAL).toBe(true);
      expect(result.passes.AAA_LARGE).toBe(true);
    });

    it("correctly identifies failing WCAG combinations", () => {
      // Light gray on white should fail all WCAG levels
      const result = textContrast("#cccccc", "#ffffff", {
        returnDetails: true,
      });

      expect(result.passes.AA_NORMAL).toBe(false);
      expect(result.passes.AA_LARGE).toBe(false);
      expect(result.passes.AAA_NORMAL).toBe(false);
      expect(result.passes.AAA_LARGE).toBe(false);
    });

    it("correctly identifies partial WCAG compliance", () => {
      // Medium gray should pass AA but not AAA normal
      const result = textContrast("#666666", "#ffffff", {
        returnDetails: true,
      });

      // Should pass AA (both normal and large) and AAA large, but not AAA normal
      expect(result.passes.AA_NORMAL).toBe(true); // 5.74 > 4.5
      expect(result.passes.AA_LARGE).toBe(true); // 5.74 > 3.0
      expect(result.passes.AAA_NORMAL).toBe(false); // 5.74 < 7.0
      expect(result.passes.AAA_LARGE).toBe(true); // 5.74 > 4.5
    });
  });

  describe("## input format flexibility", () => {
    it("accepts Contrastrast instances", () => {
      const color1 = new Contrastrast("#000000");
      const color2 = new Contrastrast("#ffffff");
      const result = textContrast(color1, color2);
      expect(result).toBeCloseTo(21, 1);
    });

    it("accepts mixed input types", () => {
      const color1 = new Contrastrast("#000000");
      const result = textContrast(color1, "#ffffff");
      expect(result).toBeCloseTo(21, 1);
    });

    it("handles different color formats consistently", () => {
      const resultHex = textContrast("#ff0000", "#ffffff");
      const resultRgb = textContrast("rgb(255, 0, 0)", "#ffffff");
      const resultHsl = textContrast("hsl(0, 100%, 50%)", "#ffffff");

      expect(resultHex).toBeCloseTo(resultRgb, 2);
      expect(resultRgb).toBeCloseTo(resultHsl, 2);
    });
  });

  describe("## edge cases", () => {
    it("handles identical colors", () => {
      const result = textContrast("#ff0000", "#ff0000");
      expect(result).toBeCloseTo(1, 1);
    });

    it("handles identical colors with detailed results", () => {
      const result = textContrast("#ff0000", "#ff0000", {
        returnDetails: true,
      });

      expect(result.ratio).toBeCloseTo(1, 1);
      expect(result.passes.AA_NORMAL).toBe(false);
      expect(result.passes.AA_LARGE).toBe(false);
      expect(result.passes.AAA_NORMAL).toBe(false);
      expect(result.passes.AAA_LARGE).toBe(false);
    });

    it("handles very dark color combinations", () => {
      const result = textContrast("#010101", "#000000");
      expect(result).toBeGreaterThan(1);
      expect(result).toBeLessThan(1.1);
    });

    it("handles very light color combinations", () => {
      const result = textContrast("#fefefe", "#ffffff");
      expect(result).toBeGreaterThan(1);
      expect(result).toBeLessThan(1.1);
    });
  });

  describe("## known WCAG reference values", () => {
    it("ensures a WCAG AAA Normal and Large reference color pair returns the correct values", () => {
      // Expected 8.87:1 AAA Normal and Large test, passes all
      const result = textContrast("#96fdc1", "#383F34", {
        returnDetails: true,
      });

      expect(result.ratio).toBeCloseTo(8.87, 1);
      expect(result.passes.AA_NORMAL).toBe(true);
      expect(result.passes.AA_LARGE).toBe(true);
      expect(result.passes.AAA_NORMAL).toBe(true);
      expect(result.passes.AAA_LARGE).toBe(true);
    });

    it("ensures a WCAG AAA Normal and Large borderline reference color pair returns the correct values", () => {
      // Expected 7.03:1 AAA Normal and Large, passes all (borderline)
      const result = textContrast("#ffffff", "#4d5a6a", {
        returnDetails: true,
      });

      expect(result.ratio).toBeCloseTo(7.03, 1);
      expect(result.passes.AA_NORMAL).toBe(true);
      expect(result.passes.AA_LARGE).toBe(true);
      expect(result.passes.AAA_NORMAL).toBe(true);
      expect(result.passes.AAA_LARGE).toBe(true);
    });

    it("ensures a WCAG AAA Large and AA Normal reference color pair returns the correct values", () => {
      // Expected 5.72:1 AAA Large, only AA normal
      const result = textContrast("#ffffff", "#845c5c", {
        returnDetails: true,
      });

      expect(result.ratio).toBeCloseTo(5.72, 1);
      expect(result.passes.AA_NORMAL).toBe(true); // 5.72 > 4.5
      expect(result.passes.AA_LARGE).toBe(true); // 5.72 > 3.0
      expect(result.passes.AAA_NORMAL).toBe(false); // 5.72 < 7.0
      expect(result.passes.AAA_LARGE).toBe(true); // 5.72 > 4.5
    });

    it("ensures a WCAG AA Large only reference color pair returns the correct values", () => {
      // Expected 3.75:1 AA Large only, fails AAA Large and all Normal
      const result = textContrast("#ffffff", "#9c7c7c", {
        returnDetails: true,
      });

      expect(result.ratio).toBeCloseTo(3.75, 1);
      expect(result.passes.AA_NORMAL).toBe(false); // 3.75 < 4.5
      expect(result.passes.AA_LARGE).toBe(true); // 3.75 > 3.0
      expect(result.passes.AAA_NORMAL).toBe(false); // 3.75 < 7.0
      expect(result.passes.AAA_LARGE).toBe(false); // 3.75 < 4.5
    });

    it("ensures a WCAG non-accessible reference color pair returns the correct values", () => {
      // Expected 2.46:1 non-accessible fails all
      const result = textContrast("#865959", "#a2a9b2", {
        returnDetails: true,
      });

      expect(result.ratio).toBeCloseTo(2.46, 1);
      expect(result.passes.AA_NORMAL).toBe(false); // 2.46 < 4.5
      expect(result.passes.AA_LARGE).toBe(false); // 2.46 < 3.0
      expect(result.passes.AAA_NORMAL).toBe(false); // 2.46 < 7.0
      expect(result.passes.AAA_LARGE).toBe(false); // 2.46 < 4.5
    });
  });

  describe("## options parameter", () => {
    it("ignores unused legacy options gracefully", () => {
      // Test that function works even if legacy options are passed
      const result = textContrast("#000000", "#ffffff", {
        returnDetails: false,
      });
      expect(typeof result).toBe("number");
    });

    it("defaults returnDetails to false", () => {
      const result1 = textContrast("#000000", "#ffffff");
      const result2 = textContrast("#000000", "#ffffff", {});
      const result3 = textContrast("#000000", "#ffffff", {
        returnDetails: false,
      });

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
      expect(typeof result1).toBe("number");
    });
  });
});
