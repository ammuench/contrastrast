import { getRGBFromColorString } from "./colorStringParsers";

describe("# colorStringParsers", () => {
  describe("## output consistency", () => {
    test("equal RGB and Hex colors should return the same outputs", () => {
      const TEST_HEX = "#eb4034";
      const TEST_RGB = "rgb(235, 64, 52)";

      const HEX_RESULT = getRGBFromColorString(TEST_HEX);
      const RGB_RESULT = getRGBFromColorString(TEST_RGB);

      expect(HEX_RESULT).toEqual(RGB_RESULT);
    });

    test("HSL should be within 2 points of the equivalent RGB values", () => {
      const TEST_RGB = "rgb(235, 64, 52)";
      const TEST_HSL = "hsl(4°, 82%, 56%)";

      const HSL_RESULT = getRGBFromColorString(TEST_HSL);
      const RGB_RESULT = getRGBFromColorString(TEST_RGB);

      const RED_DIFF = Math.abs(HSL_RESULT.r - RGB_RESULT.r);
      const BLUE_DIFF = Math.abs(HSL_RESULT.b - RGB_RESULT.b);
      const GREEN_DIFF = Math.abs(HSL_RESULT.g - RGB_RESULT.g);

      expect(RED_DIFF).toBeLessThan(2);
      expect(BLUE_DIFF).toBeLessThan(2);
      expect(GREEN_DIFF).toBeLessThan(2);
    });
  });
});
