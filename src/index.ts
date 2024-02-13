import { CONTRAST_THRESHOLD } from "@/constants";
import { RGBValues } from "@/types/RGB.types";

export const determineRecommendedTextValue = (rgb: RGBValues) => {
  // http://www.w3.org/TR/AERT#color-contrast
  const brightness = Math.round(
    (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  );
  return brightness > CONTRAST_THRESHOLD ? "dark" : "light";
};
