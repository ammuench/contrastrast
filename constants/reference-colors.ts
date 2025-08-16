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
} as const;
