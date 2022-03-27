import ts from "rollup-plugin-ts"
import pkg from "../../package.json"
import { builtinModules } from "module"
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

const tsWithDeclarations = [
  ...sharedPlugins,
  ts({
    hook: {
      outputPath: (_, kind) => {
        if (kind === "declaration") return path.resolve(pkg.types)
      }
    },
    ...overrideConfigFile({ declarationMap: false, declaration: false, allowJs: false })
  })
]

export default {
  ...shared,
  plugins: tsWithDeclarations,
  output: { format: "cjs", file: "dist/cjs/index.js", sourcemap: false }
}
