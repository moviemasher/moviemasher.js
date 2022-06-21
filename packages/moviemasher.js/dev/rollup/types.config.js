import { builtinModules } from "module"
import ts from "rollup-plugin-ts"
import json from "@rollup/plugin-json"

import pkg from "../../package.json"

const { source, devDependencies } = pkg

export default {
  input: source,
  output: { format: "umd", name: "MovieMasher", file: "dist/moviemasher.js" },
  plugins: [
    json({ preferConst: true, indent: "  ", namedExports: true }),
    ts({ 
      tsconfig: config => ({ ...config, declaration: true, declarationMap: true }) 
    })
  ],
  external: [...builtinModules, ...Object.keys(devDependencies || {})],
}
