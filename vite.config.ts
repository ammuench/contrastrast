/// <reference types="vitest" />
/// <reference types="vite/client" />
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "contrastrast",
      fileName: "contrastrast",
    },
  },
  plugins: [dts()],
  test: {
    include: ["**/*.test.ts"],
    globals: true,
    coverage: {
      provider: "istanbul",
    },
  },
});
