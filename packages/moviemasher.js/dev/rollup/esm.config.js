import { builtinModules } from "module"
import path from "path"
import ts from "rollup-plugin-ts"
import json from "@rollup/plugin-json"

import pkg from "../../package.json"

const { source, devDependencies } = pkg

export default {
  input: source,
  external: [
		...builtinModules,
		...(devDependencies ? Object.keys(devDependencies) : []),
	],
  plugins: [
  json({ preferConst: true, indent: "  ", namedExports: true }),
  ts({
    hook: {
      outputPath: (_, kind) => {
        switch (kind) {
          case 'declarationMap': return path.resolve('./dist/moviemasher.d.ts.map')
          case 'declaration': return path.resolve('./dist/moviemasher.d.ts')
        }
      }
    },
    tsconfig: {
      fileName: "./dev/tsconfig.json",
      hook: config => ({ ...config, declarationMap: true, declaration: true })
    }
  })
],
  output: { format: "esm", file: "dist/esm/index.js", sourcemap: true }
}
