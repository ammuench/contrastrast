import { faker } from "@faker-js/faker";

import { textContrastForBGColor } from "..";

describe("# textContrastForBGColor", () => {
  test("returns a value on a valid color string and doesn't throw an error", () => {
    const VALID_COLOR = faker.color.rgb({ format: "hex" });
    const TEST_RESULT = textContrastForBGColor(VALID_COLOR);

    expect(TEST_RESULT);
  });
});
