import ts from "rollup-plugin-ts"
import { terser } from 'rollup-plugin-terser'
import { builtinModules } from "module"
import json from "@rollup/plugin-json"

import pkg from "../../package.json"

const { devDependencies, source } = pkg

export default {
  input: source,
  output: { 
    format: "umd", name: "MovieMasher", 
    file: "dist/moviemasher.min.js", 
    plugins: [terser()] 
  },
  plugins: [
    json({ preferConst: true, indent: "  ", namedExports: true }),
    ts()
  ],
  external: [...builtinModules, ...Object.keys(devDependencies || {})],
}
