import { MockInstance } from "vitest";

import { extractRGBValuesFromHex } from "./rgbConverters";

describe("# rgbConverters", () => {
  let consoleErrorSpy: MockInstance | undefined;

  beforeAll(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockReturnValue();
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
    consoleErrorSpy?.mockClear();
  });
});
