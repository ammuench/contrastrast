/**
 * Reference color values for consistent testing
 * across the contrastrast library test suite
 */

export type ReferenceColor = {
  hex: {
    colorString: string;
  };
  rgb: {
    r: number;
    g: number;
    b: number;
    colorString: string;
  };
  hsl: {
    h: string;
    s: string;
    l: string;
    colorString: string;
  };
};

export const REFERENCE_COLORS: Record<string, ReferenceColor> = {
  black: {
    hex: {
      colorString: "#000000",
    },
    rgb: {
      r: 0,
      g: 0,
      b: 0,
      colorString: "rgb(0, 0, 0)",
    },
    hsl: {
      h: "0",
      s: "0%",
      l: "0%",
      colorString: "hsl(0, 0%, 0%)",
    },
  },
  white: {
    hex: {
      colorString: "#ffffff",
    },
    rgb: {
      r: 255,
      g: 255,
      b: 255,
      colorString: "rgb(255, 255, 255)",
    },
    hsl: {
      h: "0",
      s: "0%",
      l: "100%",
      colorString: "hsl(0, 0%, 100%)",
    },
  },
  red: {
    hex: {
      colorString: "#ff0000",
    },
    rgb: {
      r: 255,
      g: 0,
      b: 0,
      colorString: "rgb(255, 0, 0)",
    },
    hsl: {
      h: "0",
      s: "100%",
      l: "50%",
      colorString: "hsl(0, 100%, 50%)",
    },
  },
  midnightBlue: {
    hex: {
      colorString: "#191970",
    },
    rgb: {
      r: 25,
      g: 25,
      b: 112,
      colorString: "rgb(25, 25, 112)",
    },
    hsl: {
      h: "240",
      s: "64%",
      l: "27%",
      colorString: "hsl(240, 64%, 27%)",
    },
  },
  lightGray: {
    hex: {
      colorString: "#cccccc",
    },
    rgb: {
      r: 204,
      g: 204,
      b: 204,
      colorString: "rgb(204, 204, 204)",
    },
    hsl: {
      h: "0",
      s: "0%",
      l: "80%",
      colorString: "hsl(0, 0%, 80%)",
    },
  },
  mediumGray: {
    hex: {
      colorString: "#767676",
    },
    rgb: {
      r: 118,
      g: 118,
      b: 118,
      colorString: "rgb(118, 118, 118)",
    },
    hsl: {
      h: "0",
      s: "0%",
      l: "46%",
      colorString: "hsl(0, 0%, 46%)",
    },
  },
  goldenrod: {
    hex: {
      colorString: "#b89c14",
    },
    rgb: {
      r: 184,
      g: 156,
      b: 20,
      colorString: "rgb(184, 156, 20)",
    },
    hsl: {
      h: "50",
      s: "80%",
      l: "40%",
      colorString: "hsl(50, 80%, 40%)",
    },
  },
  // Edge case colors for coverage testing
  veryLightGray: {
    hex: {
      colorString: "#f0f0f0",
    },
    rgb: {
      r: 240,
      g: 240,
      b: 240,
      colorString: "rgb(240, 240, 240)",
    },
    hsl: {
      h: "0",
      s: "0%",
      l: "94%",
      colorString: "hsl(0, 0%, 94%)",
    },
  },
  pureGreen: {
    hex: {
      colorString: "#00ff00",
    },
    rgb: {
      r: 0,
      g: 255,
      b: 0,
      colorString: "rgb(0, 255, 0)",
    },
    hsl: {
      h: "120",
      s: "100%",
      l: "50%",
      colorString: "hsl(120, 100%, 50%)",
    },
  },
  pureBlue: {
    hex: {
      colorString: "#0000ff",
    },
    rgb: {
      r: 0,
      g: 0,
      b: 255,
      colorString: "rgb(0, 0, 255)",
    },
    hsl: {
      h: "240",
      s: "100%",
      l: "50%",
      colorString: "hsl(240, 100%, 50%)",
    },
  },
  pureYellow: {
    hex: {
      colorString: "#ffff00",
    },
    rgb: {
      r: 255,
      g: 255,
      b: 0,
      colorString: "rgb(255, 255, 0)",
    },
    hsl: {
      h: "60",
      s: "100%",
      l: "50%",
      colorString: "hsl(60, 100%, 50%)",
    },
  },
  // HSL edge case colors for RGB converter coverage testing
  purplishBlue: {
    hex: {
      colorString: "#6600cc",
    },
    rgb: {
      r: 102,
      g: 0,
      b: 204,
      colorString: "rgb(102, 0, 204)",
    },
    hsl: {
      h: "270",
      s: "100%",
      l: "40%",
      colorString: "hsl(270, 100%, 40%)",
    },
  },
  magenta: {
    hex: {
      colorString: "#cc3399",
    },
    rgb: {
      r: 204,
      g: 51,
      b: 153,
      colorString: "rgb(204, 51, 153)",
    },
    hsl: {
      h: "320",
      s: "75%",
      l: "50%",
      colorString: "hsl(320, 75%, 50%)",
    },
  },
} as const;
