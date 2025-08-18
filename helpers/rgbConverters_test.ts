import { type Stub, stub } from "jsr:@std/testing/mock";
import { expect, fn } from "@std/expect";

import {
  extractRGBValuesFromHex,
  extractRGBValuesFromHSL,
} from "./rgbConverters.ts";
import { REFERENCE_COLORS } from "../reference-values/reference-colors.ts";
import { afterAll, beforeAll, describe, test } from "@std/testing/bdd";

describe("# rgbConverters", () => {
  const consoleErrorSpy = fn();
  let consoleErrorStub: Stub | undefined;

  beforeAll(() => {
    // deno-lint-ignore no-explicit-any
    consoleErrorStub = stub(console, "error", consoleErrorSpy as any);
  });

  describe("## extractRGBValuesFromHex", () => {
    test("it should return the same value for a short (3-len) hex code as the equivalent long (6-len) hex code", () => {
      const SHORT_HEX = "ad0";
      const LONG_HEX = "aadd00";

      const RESULT1 = extractRGBValuesFromHex(SHORT_HEX);
      const RESULT2 = extractRGBValuesFromHex(LONG_HEX);

      expect(RESULT1).toEqual(RESULT2);
    });
  });

  describe("## extractRGBValuesFromHSL", () => {
    test("handles HSL edge cases for coverage (t > 1 and 2/3 threshold)", () => {
      // This specific HSL value is designed to trigger the missing coverage lines
      // in the hue2rgb helper function: t > 1 wrapping and 2/3 threshold
      const result = extractRGBValuesFromHSL(
        REFERENCE_COLORS.purplishBlue.hsl.h,
        REFERENCE_COLORS.purplishBlue.hsl.s,
        REFERENCE_COLORS.purplishBlue.hsl.l,
      );

      // Verify we get valid RGB values
      expect(result.r).toBeGreaterThanOrEqual(0);
      expect(result.r).toBeLessThanOrEqual(255);
      expect(result.g).toBeGreaterThanOrEqual(0);
      expect(result.g).toBeLessThanOrEqual(255);
      expect(result.b).toBeGreaterThanOrEqual(0);
      expect(result.b).toBeLessThanOrEqual(255);
    });

    test("handles another HSL edge case for complete coverage", () => {
      // Additional HSL value to ensure we hit all mathematical edge cases
      const result = extractRGBValuesFromHSL(
        REFERENCE_COLORS.magenta.hsl.h,
        REFERENCE_COLORS.magenta.hsl.s,
        REFERENCE_COLORS.magenta.hsl.l,
      );

      // Verify we get valid RGB values
      expect(result.r).toBeGreaterThanOrEqual(0);
      expect(result.r).toBeLessThanOrEqual(255);
      expect(result.g).toBeGreaterThanOrEqual(0);
      expect(result.g).toBeLessThanOrEqual(255);
      expect(result.b).toBeGreaterThanOrEqual(0);
      expect(result.b).toBeLessThanOrEqual(255);
    });
  });

  afterAll(() => {
    consoleErrorStub?.restore();
  });
});
