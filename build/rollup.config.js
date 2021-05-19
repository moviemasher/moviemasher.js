import ts from "@wessberg/rollup-plugin-ts";
import json from "@rollup/plugin-json"
import resolve from "@rollup/plugin-node-resolve"
import flatDts from 'rollup-plugin-flat-dts';
import { terser } from 'rollup-plugin-terser';

const resolveOptions = {
  extensions: [".js", ".ts"],
  browser: true,
  preferBuiltins: true
}
const jsonOptions = { preferConst: true, indent: "  ", namedExports: true }

const plugins = [resolve(resolveOptions), json(jsonOptions)]

const tsOptions = { tsconfig: "build/tsconfig.rollup.json" }

const tsOptionsWithTypes = {
  tsconfig: {
    fileName: "build/tsconfig.rollup.json",
    hook: config => ({declarationMap: true, declaration: true, ...config })
  }
}

const dist = {
  input: "src/index.js",
  plugins: [...plugins, ts(tsOptions)],
  output: [
    {
      dir: "dist/esm",
      format: "esm",
      sourcemap: true,
    },
    {
      dir: "dist/cjs",
      format: "cjs",
      sourcemap: true,
    }
  ],
}
const outputUmd = {
  format: "umd",
  name: "MovieMasher",
  exports: "named",
  esModule: false,
}

const umd = {
  input: "src/index.umd.js",
  plugins: [...plugins, ts(tsOptionsWithTypes)],
  output: {
    ...outputUmd,
    file: "dist/moviemasher.js",
    plugins: [flatDts()],
  }
}

const terse = {
  input: "src/index.umd.js",
  plugins: [...plugins, ts(tsOptions)],
  output: {
    ...outputUmd,
    sourcemap: true,
    file: "dist/moviemasher.min.js",
    plugins: [terser()]
  }
}
export default [dist, umd, terse]
