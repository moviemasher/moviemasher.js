import { builtinModules } from "module"
import ts from "rollup-plugin-ts"
import json from "@rollup/plugin-json"

import pkg from "../../package.json"

const { source, devDependencies, module } = pkg

export default {
  input: source,
  output: { format: "esm", file: module },
  plugins: [
    json({ preferConst: true, indent: "  ", namedExports: true }),
    ts()
  ],
  external: [...builtinModules, ...Object.keys(devDependencies || {})],
}
