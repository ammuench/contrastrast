import denoCfg from "../deno.json" with { type: "json" };
import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./main.ts"],
  outDir: "./npm",
  importMap: "deno.json",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "contrastrast",
    description:
      "A lightweight tool that parses color strings and recommends text contrast based on WCAG Standards",
    license: "MIT",
    version: denoCfg.version,
    repository: {
      type: "git",
      url: "https://github.com/ammuench/contrastrast.git",
    },
    keywords: [
      "wcag",
      "text color",
      "text contrast",
      "constrast",
      "readability",
      "legible",
      "a11y",
      "colors",
      "accessibility",
      "color contrast",
    ],
    author: "Alex Muench <hello@alexmuen.ch> (https://alexmuen.ch/)",
    bugs: {
      url: "https://github.com/ammuench/contrastrast/issues",
    },
  },
  compilerOptions: {
    lib: ["ESNext"],
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
