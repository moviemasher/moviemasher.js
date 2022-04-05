import { builtinModules } from "module"
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import ts from "rollup-plugin-ts"
import json from "@rollup/plugin-json"

import pkg from "../../package.json"

const { main, source, devDependencies } = pkg

export default {
  external: [...builtinModules, ...Object.keys(devDependencies || {})],
  input: source,
  output: { format: "cjs", file: main, sourcemap: false },
  plugins: [
    peerDepsExternal(),
    json( { preferConst: true, indent: "  ", namedExports: true }),
    ts({ tsconfig: "./dev/tsconfig.json" })
  ],
}
