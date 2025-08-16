/**
 * WCAG contrast test reference values for consistent testing
 * across the contrastrast library test suite
 */

export type WCAGTestValues = {
  foreground: string;
  background: string;
  expectedContrastRatio: number;
  testCondition: string;
  expectedWCAGResults: {
    AA_NORMAL: boolean;
    AA_LARGE: boolean;
    AAA_NORMAL: boolean;
    AAA_LARGE: boolean;
  };
};

export const WCAG_CONTRAST_REFERENCE: Record<string, WCAGTestValues> = {
  // 8.87:1 AAA Normal and Large test, passes all
  allCompliant: {
    foreground: "#96fdc1",
    background: "#383F34",
    expectedContrastRatio: 8.87,
    testCondition: "passes all WCAG levels (AAA Normal/Large compliant)",
    expectedWCAGResults: {
      AA_NORMAL: true,
      AA_LARGE: true,
      AAA_NORMAL: true,
      AAA_LARGE: true,
    },
  },

  // 5.72:1 AAA Large, only AA normal
  aaaLargeOnly: {
    foreground: "#ffffff",
    background: "#845c5c",
    expectedContrastRatio: 5.72,
    testCondition: "passes AAA Large and AA Normal/Large but fails AAA Normal",
    expectedWCAGResults: {
      AA_NORMAL: true,
      AA_LARGE: true,
      AAA_NORMAL: false,
      AAA_LARGE: true,
    },
  },

  // 3.75:1 AA Large only, fails AAA Large and all Normal
  aaLargeOnly: {
    foreground: "#ffffff",
    background: "#9c7c7c",
    expectedContrastRatio: 3.75,
    testCondition: "passes only AA Large, fails all other levels",
    expectedWCAGResults: {
      AA_NORMAL: false,
      AA_LARGE: true,
      AAA_NORMAL: false,
      AAA_LARGE: false,
    },
  },

  // 2.46:1 non-accessible fails all
  nonCompliant: {
    foreground: "#865959",
    background: "#a2a9b2",
    expectedContrastRatio: 2.46,
    testCondition: "fails all WCAG levels (non-accessible)",
    expectedWCAGResults: {
      AA_NORMAL: false,
      AA_LARGE: false,
      AAA_NORMAL: false,
      AAA_LARGE: false,
    },
  },

  // 7.03:1 AAA Normal and Large borderline test
  aaaNormalBorderline: {
    foreground: "#ffffff",
    background: "#4d5a6a",
    expectedContrastRatio: 7.03,
    testCondition:
      "borderline AAA Normal compliance (just above 7:1 threshold)",
    expectedWCAGResults: {
      AA_NORMAL: true,
      AA_LARGE: true,
      AAA_NORMAL: true,
      AAA_LARGE: true,
    },
  },

  // 3.11:1 - precise boundary case for specific contrast ratio testing
  preciseBoundary: {
    foreground: "#929292",
    background: "#FFFFFF",
    expectedContrastRatio: 3.11,
    testCondition:
      "precise boundary testing (just above AA Large 3:1 threshold)",
    expectedWCAGResults: {
      AA_NORMAL: false,
      AA_LARGE: true, // 3.11:1 passes AA Large (3:1 requirement)
      AAA_NORMAL: false,
      AAA_LARGE: false,
    },
  },

  // 1:1 - identical colors always fail
  identicalColors: {
    foreground: "#ff0000",
    background: "#ff0000",
    expectedContrastRatio: 1.0,
    testCondition: "identical colors (1:1 ratio, always fails)",
    expectedWCAGResults: {
      AA_NORMAL: false,
      AA_LARGE: false,
      AAA_NORMAL: false,
      AAA_LARGE: false,
    },
  },

  // 21:1 - maximum contrast (black vs white)
  maximumContrast: {
    foreground: "#000000",
    background: "#ffffff",
    expectedContrastRatio: 21.0,
    testCondition: "maximum possible contrast (black vs white, 21:1)",
    expectedWCAGResults: {
      AA_NORMAL: true,
      AA_LARGE: true,
      AAA_NORMAL: true,
      AAA_LARGE: true,
    },
  },

  // 14.85:1 - midnight blue vs white (from existing reference colors)
  midnightBlueWhite: {
    foreground: "#191970",
    background: "#ffffff",
    expectedContrastRatio: 14.85,
    testCondition:
      "high contrast with reference colors (midnight blue vs white)",
    expectedWCAGResults: {
      AA_NORMAL: true,
      AA_LARGE: true,
      AAA_NORMAL: true,
      AAA_LARGE: true,
    },
  },

  // 1.61:1 - light gray vs white (low contrast, fails all)
  lightGrayWhite: {
    foreground: "#CCCCCC",
    background: "#ffffff",
    expectedContrastRatio: 1.61,
    testCondition: "very low contrast (light gray vs white, fails all)",
    expectedWCAGResults: {
      AA_NORMAL: false,
      AA_LARGE: false,
      AAA_NORMAL: false,
      AAA_LARGE: false,
    },
  },
};
