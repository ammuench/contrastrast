export type WCAGLevel = "AA" | "AAA";

export type TextSize = "normal" | "large";

export type ContrastResult = {
  ratio: number;
  passes: {
    AA_NORMAL: boolean;
    AA_LARGE: boolean;
    AAA_NORMAL: boolean;
    AAA_LARGE: boolean;
  };
  details: {
    required: number;
    actual: number;
    level: WCAGLevel;
    textSize: TextSize;
  };
};

export type ContrastOptions = {
  level?: WCAGLevel;
  textSize?: TextSize;
  returnDetails?: boolean;
};

export type HSLValues = {
  h: number;
  s: number;
  l: number;
};
