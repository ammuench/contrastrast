import { Stub, stub } from "@std/testing/mock";
import { expect, fn } from "@std/expect";
import { afterAll, beforeAll, describe, test } from "@std/testing/bdd";

import { faker } from "npm:@faker-js/faker";

import { ContrastrastOptions } from "../types/contrastrastOptionts.types.ts";
import { textContrastForBGColor } from "../main.ts";

describe("# textContrastForBGColor", () => {
  const consoleErrorSpy = fn();
  let consoleErrorStub: Stub | undefined;

  beforeAll(() => {
    // deno-lint-ignore no-explicit-any
    consoleErrorStub = stub(console, "error", consoleErrorSpy as any);
  });

  describe("## success states", () => {
    test("it returns a value on a valid hex color string and doesn't log an error", () => {
      const VALID_COLOR = faker.color.rgb({ format: "hex" });
      const TEST_RESULT = textContrastForBGColor(VALID_COLOR);

      expect(TEST_RESULT).toMatch(/(dark|light)/);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
    test("it returns a value on a valid rgb string and doesn't log an error", () => {
      const VALID_COLOR = faker.color.rgb({ format: "css" });
      const TEST_RESULT = textContrastForBGColor(VALID_COLOR);

      expect(TEST_RESULT).toMatch(/(dark|light)/);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
    test("it returns a value on a valid hsl string and doesn't log an error", () => {
      const VALID_COLOR = faker.color.hsl({ format: "css" });
      const TEST_RESULT = textContrastForBGColor(VALID_COLOR);

      expect(TEST_RESULT).toMatch(/(dark|light)/);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("## error states", () => {
    test("it returns fallback value on invalid color string, and logs error by default", () => {
      const INVALID_COLOR = "~~~";
      const EXPECTED_FALLBACK: ContrastrastOptions["fallbackOption"] = "light";
      const TEST_RESULT = textContrastForBGColor(INVALID_COLOR, {
        fallbackOption: EXPECTED_FALLBACK,
      });

      expect(TEST_RESULT).toEqual(EXPECTED_FALLBACK);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("## options config", () => {
    test("it returns the fallbackOption when explicitly declared", () => {
      const INVALID_COLOR = "~~~";
      const EXPECTED_FALLBACK1: ContrastrastOptions["fallbackOption"] = "light";
      const TEST_RESULT1 = textContrastForBGColor(INVALID_COLOR, {
        fallbackOption: EXPECTED_FALLBACK1,
      });
      const EXPECTED_FALLBACK2: ContrastrastOptions["fallbackOption"] = "dark";
      const TEST_RESULT2 = textContrastForBGColor(INVALID_COLOR, {
        fallbackOption: EXPECTED_FALLBACK2,
      });

      expect(TEST_RESULT1).toEqual(EXPECTED_FALLBACK1);
      expect(TEST_RESULT2).toEqual(EXPECTED_FALLBACK2);
    });
    // test("it throws an error instead of a console log when `throwErrorOnUnhandled` is true", () => {
    //   const INVALID_COLOR = "~~~";
    //   expect(() => {
    //     textContrastForBGColor(INVALID_COLOR, {
    //       throwErrorOnUnhandled: true,
    //     });
    //   }).toThrowError();
    // });
  });

  afterAll(() => {
    consoleErrorStub?.restore();
  });
});
