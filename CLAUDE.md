# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

**contrastrast** is a comprehensive TypeScript/Deno library for color
manipulation, parsing, conversion, and accessibility analysis. Built with WCAG
2.1 standards, it provides full contrast ratio calculations, accessibility
compliance checking, and multi-format color support (HEX, RGB, HSL).

## Development Commands

### Core Development

- `deno run --watch mod.ts` - Run in development mode with file watching
- `deno test` - Run all tests (uses Deno's built-in test runner with
  @std/testing and @std/expect)
- `deno test <pattern>` - Run specific test files matching pattern
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
mod.ts                    # Main export entry point (v1.0.x + legacy v0.3.x API)
contrastrast.ts          # Main Contrastrast class implementation
constants.ts             # Shared constants (CONTRAST_THRESHOLD, WCAG thresholds)
types/                   # TypeScript type definitions
  ├── Colors.types.ts    # RGBValues, HSLValues types
  ├── ParseOptions.types.ts # ParseOptions configuration
  └── WCAG.types.ts      # WCAG compliance types
utils/                   # Standalone utility functions
  ├── textContrast.ts    # Contrast calculation with WCAG analysis
  └── contrastRatio.ts   # Basic contrast ratio calculation
helpers/                 # Color parsing and conversion utilities
  ├── colorStringParsers.ts # Multi-format color string parsing
  └── rgbConverters.ts   # Format conversion utilities
legacy/                  # v0.3.x backward compatibility
  └── textContrastForBGColor.ts # Deprecated simple contrast function
```

### Key Components

**Contrastrast Class** (`contrastrast.ts`)

- Main API entry point with comprehensive color manipulation
- Factory methods: `fromHex()`, `fromRgb()`, `fromHsl()`, `parse()`
- WCAG 2.1 compliant luminance and contrast calculations
- Format conversion: `toHex()`, `toRgb()`, `toHsl()`, plus string variants
- Accessibility methods: `contrastRatio()`, `meetsWCAG()`, `isLight()`,
  `isDark()`

**WCAG Utilities** (`utils/`)

- `textContrast()` - Detailed WCAG analysis with compliance breakdown
- `contrastRatio()` - Basic contrast ratio calculation between any two colors
- Support for both simple ratios and detailed compliance reports

**Color Parsing Pipeline** (`helpers/colorStringParsers.ts`)

- Unified parser supporting HEX (#abc, #abcdef), RGB (rgb(r,g,b)), HSL
  (hsl(h,s%,l%))
- Error handling with configurable fallback behavior
- Regex-based format detection and value extraction

**RGB Conversion System** (`helpers/rgbConverters.ts`)

- `extractRGBValuesFromHex()` - 3/6 digit hex code conversion
- `extractRGBValuesFromHSL()` - HSL to RGB using standard color space conversion
- `extractRGBValuesFromRGBStrings()` - RGB string parsing and validation

### Dual Distribution Strategy

- **Deno/JSR**: Primary development environment (@amuench/contrastrast)
- **NPM**: Node.js distribution via @deno/dnt transpilation (contrastrast)
- Build script (`scripts/build_npm.ts`) handles package.json generation and
  asset copying
- Version synchronization between deno.json and generated package.json

### Testing Approach

- Co-located test files using `.test.ts` suffix
- Comprehensive test coverage for color parsing, conversion, and WCAG
  calculations
- Uses @std/testing framework with @std/expect assertions
- Faker.js integration for property-based testing with random color generation
- Reference values in `reference-values/` for WCAG compliance validation

### API Evolution

The library maintains backward compatibility while providing a modern v1.0+ API:

- **v1.0.x**: Full-featured Contrastrast class with WCAG 2.1 compliance
- **v0.3.x Legacy**: Simple `textContrastForBGColor()` function (deprecated)
- Dual export strategy allows gradual migration from legacy API

### Error Handling Strategy

- **ParseOptions**: Configurable error handling with `throwOnError` and
  `fallbackColor`
- **Graceful Degradation**: Invalid colors can fallback to defaults instead of
  throwing
- **Type Safety**: Full TypeScript support with comprehensive type definitions
  for all APIs

### Publishing Workflow

- **JSR Publishing**: OIDC-authenticated via GitHub Actions to jsr.io
- **NPM Publishing**: Automated build and publish to npmjs.org
- **Version Management**: Single source of truth in deno.json with validation
- **Release Creation**: Automatic GitHub releases with generated notes
