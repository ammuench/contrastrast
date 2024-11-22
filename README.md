![contrastrast](https://github.com/ammuench/contrastrast/assets/2099658/8b7a90b0-3874-4650-a575-1170063d3462)

[![JSR](https://jsr.io/badges/@<scope>/<package>)](https://jsr.io/@<scope>/<package>)
[![npm version](https://badge.fury.io/js/contrastrast.svg)](https://badge.fury.io/js/contrastrast)

# constrastrast

A lightweight tool that parses color strings and recommends text contrast based
on [WCAG Standards](http://www.w3.org/TR/AERT#color-contrast)

## Installation

Install `constrastrast` by running one of the following commands:

```bash
npm install --save constrastrast

yarn add constrastrast

pnpm install --save constrastrast

deno add contrastrast
```

## How it works

`constrastrast` takes a given background color as a string in either HEX, HSL,
or RGB format, and (by default) returns `"dark"` or `"light"` as a recommended
text variant for that given background color

For example, you may use it like this:

```tsx
import { textContrastForBGColor } from "contrastrast";

const MyColorChangingComponent = (backgroundColor: string) => {
    return <div style={{ backgroundColor }} className={textContrastForBGColor(backgroundColor) === "dark" : "text-black" : "text-white"}>
        This text is readable no matter what the background color is!
    </div>
}
```

## Supported Color Formats

`constrastrast` supports the following color string formats:

### HEX

HEX Notation in either 3 or 6 length format

**examples**

```
#ad1232

ad1232

#ada

ada
```

### RGB

Standard RGB notation

**examples**

```
rgb(100,200, 230)

rgb(5, 30, 40)
```

### HSL

HSL Notation with or without the symbol markers

**examples**

```
hsl(217°, 90%, 61%)

hsl(72°, 90%, 61%)

hsl(121deg, 90%, 61%)

hsl(298, 90, 61)
```

### Alpha Formats

Currently `contrastrast` doesn't support alpha formats and will log an error and
return the default value

### Unhandled Formats

If an unhandled string is passed, by default `contrastrast` will log an error
and return the default value (`"dark"`)

## Options

`textContrastForBGColor` takes an `ContrastrastOptions` object as an optional
second parameter, it currently has the following configuration options:

```ts
type ContrastrastOptions = {
  fallbackOption?: "dark" | "light"; // Defaults to "dark" if not specified
  throwErrorOnUnhandled?: boolean; // Throws an error instead of returning the `fallbackOption`.  Defaults to `false` if not specific
};
```

## Contributing

Happy for any and all contributions. Please note the project uses `pnpm` and I
prefer to have git commits formatted with
[`gitmoji-cli`](https://github.com/carloscuesta/gitmoji-cli)
