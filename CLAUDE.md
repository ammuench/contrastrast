# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

**contrastrast** is a lightweight TypeScript/Deno library that parses color
strings (HEX, RGB, HSL) and recommends text contrast ("dark" or "light") based
on WCAG standards. The library uses the WCAG brightness calculation formula to
determine optimal text color for accessibility.

## Development Commands

### Core Development

- `deno run --watch mod.ts` - Run in development mode with file watching
- `deno test` - Run all tests (uses Deno's built-in test runner with
  @std/testing and @std/expect)
- `deno lint` - Lint TypeScript files
- `deno fmt` - Format TypeScript and other files

### Build and Distribution

- `deno run -A scripts/build_npm.ts` - Build NPM distribution package (outputs
  to `./npm/`)
- `deno task build:npm` - Same as above (task alias)

### Quality Assurance

- `deno lint --fix` - Auto-fix linting issues
- Pre-commit hooks use lint-staged with deno lint and deno fmt

## Architecture

### Core Module Structure

```
mod.ts                           # Main export entry point
constants.ts                     # Shared constants (CONTRAST_THRESHOLD, defaults)
types/                           # TypeScript type definitions
  ├── RGB.types.ts              # RGBValues type
  └── contrastrastOptionts.types.ts # ContrastrastOptions type
modules/
  └── textContrastForBGColor.ts  # Main contrast calculation logic
helpers/
  ├── colorStringParsers.ts      # Color string parsing (HEX, RGB, HSL)
  └── rgbConverters.ts          # Color format conversion utilities
```

### Key Components

**textContrastForBGColor** (`modules/textContrastForBGColor.ts:20`)

- Main function that takes a color string and returns "dark" or "light"
- Uses WCAG brightness formula: `(r * 299 + g * 587 + b * 114) / 1000`
- Compares against `CONTRAST_THRESHOLD` (124) from `constants.ts:3`

**Color Parsing Pipeline** (`helpers/colorStringParsers.ts:17`)

- Supports HEX (#abc, #abcdef), RGB (rgb(r,g,b)), and HSL (hsl(h,s%,l%)) formats
- Uses regex patterns to identify and extract color values
- Delegates to specific converter functions in `rgbConverters.ts`

**RGB Conversion Utilities** (`helpers/rgbConverters.ts`)

- `extractRGBValuesFromHex` - Handles 3 and 6 character hex codes
- `extractRGBValuesFromHSL` - Converts HSL to RGB using standard formula
- `extractRGBValuesFromRGBStrings` - Parses RGB string values to numbers

### Dual Distribution Strategy

The project uses Deno for development but builds to NPM for broader
compatibility:

- **Deno**: Primary development environment with native TypeScript support
- **NPM Build**: Uses `@deno/dnt` to transpile to Node.js-compatible package in
  `./npm/`
- Both JSR (@amuench/contrastrast) and NPM (contrastrast) distributions are
  supported

### Testing Approach

- Co-located test files using `.test.ts` suffix
- Uses Deno's built-in test runner with `@std/testing` and `@std/expect`
- Tests cover color parsing, RGB conversion, and contrast calculation logic
- Faker.js used for generating test data

## Error Handling Strategy

The library follows a graceful degradation pattern:

- Invalid color strings trigger fallback to default option ("dark" by default)
- `throwErrorOnUnhandled` option can force errors instead of fallbacks
- All parsing errors are caught and logged with context

## Development Workflow

### Feature Planning

- Use the `__SPECS__/` directory for feature planning and specification
  documents
- Create markdown files in `__SPECS__/` to document new features before
  implementation
- This directory is gitignored to keep planning documents local to your
  development environment
