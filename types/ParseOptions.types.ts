/**
 * Configuration options for parsing color strings
 */
export type ParseOptions = {
  /** Whether to throw an error on invalid color strings (default: true) */
  throwOnError: boolean;
  /** Fallback color to use when throwOnError is false (default: "#000000") */
  fallbackColor?: string;
};
