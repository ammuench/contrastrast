/**
 * RGB color values
 */
export type RGBValues = {
  /** Red component (0-255) */
  r: number;
  /** Green component (0-255) */
  g: number;
  /** Blue component (0-255) */
  b: number;
};

/**
 * HSL color values
 */
export type HSLValues = {
  /** Hue in degrees (0-360) */
  h: number;
  /** Saturation percentage (0-100) */
  s: number;
  /** Lightness percentage (0-100) */
  l: number;
};
