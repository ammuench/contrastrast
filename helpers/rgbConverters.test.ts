import { Stub, stub } from "jsr:@std/testing/mock";
import { expect, fn } from "@std/expect";

import { extractRGBValuesFromHex } from "./rgbConverters.ts";
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

  afterAll(() => {
    consoleErrorStub?.restore();
  });
});
