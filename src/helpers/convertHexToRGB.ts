import { RGBValues } from "@/types/RGB.types";

export const hex2rgb = (hex: string): RGBValues => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // return {r, g, b}
  return { r, g, b };
};
