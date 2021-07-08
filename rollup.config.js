import ts from "rollup-plugin-ts"
import { terser } from 'rollup-plugin-terser'
import pkg from "./package.json";
import { builtinModules } from "module";
import path from "path"
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
const tsWithDeclarations = [
  ...sharedPlugins,
  ts({
    hook: {
      outputPath: (_, kind) => {
        if (kind === "declaration") return path.resolve(pkg.types)
      }
    },
    ...overrideConfigFile({ declarationMap: true, declaration: true })
  })
]

const cjs = {
  ...shared,
  plugins: tsWithDeclarations,
  output: { format: "cjs", file: pkg.main, sourcemap: true }
}
const esm = {
  ...shared,
  plugins: tsWithDeclarations,
  output: { format: "esm", file: pkg.module, sourcemap: true }
}

const outputUmd = {
  format: "umd",
  name: "MovieMasher",
  sourcemap: true,
  esModule: false,
}
const umd = {
  ...shared,
  plugins: tsWithoutDeclarations,
  output: [
    { ...outputUmd, file: "dist/moviemasher.js" },
    { ...outputUmd, file: "dist/moviemasher.min.js", plugins: [terser()] },
  ]
}

export default [umd, esm, cjs]
