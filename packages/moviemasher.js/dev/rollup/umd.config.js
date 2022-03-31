import ts from "rollup-plugin-ts"
import { terser } from 'rollup-plugin-terser'
import { builtinModules } from "module"
import json from "@rollup/plugin-json"

import pkg from "../../package.json"

const { devDependencies, source } = pkg

const outputUmd = {
  format: "umd",
  name: "MovieMasher",
  sourcemap: true,
  esModule: false,
}

export default {
  external: [...builtinModules, ...Object.keys(devDependencies || {})],
  input: source,
  output: [
    { ...outputUmd, file: "dist/moviemasher.js" },
    { ...outputUmd, file: "dist/moviemasher.min.js", plugins: [terser()] },
  ],
  plugins: [
    json({ preferConst: true, indent: "  ", namedExports: true }),
    ts({ tsconfig: "./dev/tsconfig.json" })
  ]
}
