import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { contrastRatio } from "./contrastRatio.ts";
import { Contrastrast } from "../contrastrast.ts";

describe("# contrastRatio", () => {
  describe("## basic contrast calculations", () => {
    it("calculates contrast ratio between black and white", () => {
      const ratio = contrastRatio("#000000", "#ffffff");
      expect(ratio).toBeCloseTo(21, 1);
    });

    it("calculates contrast ratio between white and black (order independence)", () => {
      const ratio = contrastRatio("#ffffff", "#000000");
      expect(ratio).toBeCloseTo(21, 1);
    });

    it("returns 1 for identical colors", () => {
      const ratio = contrastRatio("#ff0000", "#ff0000");
      expect(ratio).toBeCloseTo(1, 1);
    });

    it("handles identical colors with different formats", () => {
      const ratio = contrastRatio("#ff0000", "rgb(255, 0, 0)");
      expect(ratio).toBeCloseTo(1, 1);
    });
  });

  describe("## WCAG reference values", () => {
    it("matches known Google Blue contrast ratio", () => {
      // Google Blue (#1a73e8) on white background
      const ratio = contrastRatio("#1a73e8", "#ffffff");
      expect(ratio).toBeCloseTo(4.5, 1);
    });

    it("matches known red contrast ratio", () => {
      // Pure red on white background
      const ratio = contrastRatio("#ff0000", "#ffffff");
      expect(ratio).toBeCloseTo(3.998, 1);
    });

    it("handles gray combinations", () => {
      // Light gray on white
      const ratio = contrastRatio("#cccccc", "#ffffff");
      expect(ratio).toBeCloseTo(1.61, 1);
    });
  });

  describe("## input format flexibility", () => {
    it("accepts Contrastrast instances", () => {
      const color1 = new Contrastrast("#000000");
      const color2 = new Contrastrast("#ffffff");
      const ratio = contrastRatio(color1, color2);
      expect(ratio).toBeCloseTo(21, 1);
    });

    it("accepts mixed input types", () => {
      const color1 = new Contrastrast("#000000");
      const ratio = contrastRatio(color1, "#ffffff");
      expect(ratio).toBeCloseTo(21, 1);
    });

    it("handles different color formats", () => {
      const ratioHex = contrastRatio("#ff0000", "#ffffff");
      const ratioRgb = contrastRatio("rgb(255, 0, 0)", "#ffffff");
      const ratioHsl = contrastRatio("hsl(0, 100%, 50%)", "#ffffff");

      expect(ratioHex).toBeCloseTo(ratioRgb, 2);
      expect(ratioRgb).toBeCloseTo(ratioHsl, 2);
    });
  });

  describe("## edge cases", () => {
    it("handles very dark colors", () => {
      const ratio = contrastRatio("#010101", "#000000");
      expect(ratio).toBeGreaterThan(1);
      expect(ratio).toBeLessThan(1.1);
    });

    it("handles very light colors", () => {
      const ratio = contrastRatio("#fefefe", "#ffffff");
      expect(ratio).toBeGreaterThan(1);
      expect(ratio).toBeLessThan(1.1);
    });

    it("handles mid-tone combinations", () => {
      const ratio = contrastRatio("#808080", "#404040");
      expect(ratio).toBeGreaterThan(1);
      expect(ratio).toBeLessThan(21);
    });
  });

  describe("## WCAG compliance thresholds", () => {
    it("identifies AA normal text compliance", () => {
      // Should pass AA normal (4.5:1)
      const ratio = contrastRatio("#1a73e8", "#ffffff");
      expect(ratio).toBeGreaterThan(4.5);
    });

    it("identifies AA large text compliance", () => {
      // Should pass AA large (3:1)
      const ratio = contrastRatio("#ff0000", "#ffffff");
      expect(ratio).toBeGreaterThan(3.0);
    });

    it("identifies AAA compliance", () => {
      // Should pass AAA (7:1)
      const ratio = contrastRatio("#000080", "#ffffff");
      expect(ratio).toBeGreaterThan(7.0);
    });

    it("identifies non-compliant combinations", () => {
      // Should fail AA normal
      const ratio = contrastRatio("#cccccc", "#ffffff");
      expect(ratio).toBeLessThan(4.5);
    });
  });
});
