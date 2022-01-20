import ts from "rollup-plugin-ts"
import { terser } from 'rollup-plugin-terser'
import pkg from "../../../../package.json"
import { builtinModules } from "module"
import json from "@rollup/plugin-json"

const jsonOptions = { preferConst: true, indent: "  ", namedExports: true }

const tsconfigPath = "./tsconfig.json"
const overrideConfigFile = (options) => {
  return {
    tsconfig: {
      fileName: tsconfigPath, hook: config => ({ ...config, ...options })
    }
  }
}

const shared = {
  input: "src/index.ts",
  external: [
		...builtinModules,
		...(pkg.devDependencies ? Object.keys(pkg.devDependencies) : []),
	]
}
const sharedPlugins = [json(jsonOptions)]
const tsWithoutDeclarations = [
  ...sharedPlugins,
  ts(overrideConfigFile({ declaration: false }))
]

const outputUmd = {
  format: "umd",
  name: "MovieMasher",
  sourcemap: true,
  esModule: false,
}

export default {
  ...shared,
  plugins: tsWithoutDeclarations,
  output: [
    { ...outputUmd, file: "dist/moviemasher.js" },
    { ...outputUmd, file: "dist/moviemasher.min.js", plugins: [terser()] },
  ]
}
