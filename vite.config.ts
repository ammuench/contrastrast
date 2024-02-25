/// <reference types="vitest" />
/// <reference types="vite/client" />
import { globSync } from "glob";
import { copyFileSync } from "node:fs";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "contrastrast",
      fileName: "index",
    },
  },
  plugins: [
    dts({
      afterBuild: () => {
        // To pass publint (`npm x publint@latest`) and ensure the
        // package is supported by all consumers, we must export types that are
        // read as ESM. To do this, there must be duplicate types with the
        // correct extension supplied in the package.json exports field.
        const typeFiles = globSync("dist/**/*.d.ts");
        typeFiles.forEach((typeDFilePath) => {
          const typeDCtsFilePath = typeDFilePath.split(".d.ts")[0] + ".d.cts";
          copyFileSync(typeDFilePath, typeDCtsFilePath);
        });
      },
      include: ["src"],
    }),
  ],
  test: {
    include: ["**/*.test.ts"],
    globals: true,
    coverage: {
      provider: "istanbul",
    },
  },
});
