import { builtinModules } from "module"
import ts from "rollup-plugin-ts"
import json from "@rollup/plugin-json"

import pkg from "../../package.json"

const { main, source, devDependencies } = pkg

export default {
  input: source,
  output: { format: "cjs", file: main },
  plugins: [
    json( { preferConst: true, indent: "  ", namedExports: true }),
    ts()
  ],
  external: [...builtinModules, ...Object.keys(devDependencies || {})],
}
