import ts from "@wessberg/rollup-plugin-ts";
import json from "@rollup/plugin-json"
import resolve from "@rollup/plugin-node-resolve"
import flatDts from 'rollup-plugin-flat-dts';
import { terser } from 'rollup-plugin-terser';

const resolveOptions = {
  extensions: [".js", ".ts"],
  browser: true,
  preferBuiltins: true
}
const jsonOptions = { preferConst: true, indent: "  ", namedExports: true }
const plugins = [resolve(resolveOptions), json(jsonOptions)]


const declarations = {

  declarationMap: true,
  declaration: true,
  // experimentalDecorators: false,
  // noEmit: false,
}
const tsconfigPath = "tsconfig.json"
const tsOptions = {
  target: "ESNext",
  module: "ESNext",
  strict: false,
  allowJs: false,
  noEmit: true,
  resolveJsonModule: true,
  allowSyntheticDefaultImports: true,
}
const tsOptionsDist = {
  tsconfig: {
    fileName: tsconfigPath,
    hook: config => ({ ...config, ...tsOptions })
  }
}

const tsOptionsUmd = {
  tsconfig: {
    fileName: tsconfigPath,
    hook: config => {
      const options = { ...config, ...tsOptions, ...declarations }
      console.log("options", options)
      return options
    }
  }
}

const tsconfigRollupOrig = {
  lib: ["ESNext"],
  target: "ESNext",
  // module: "ESNext",
  rootDir: "./src",

}

const dtsOptions = {
  // tsconfig: tsconfigPath,
  compilerOptions: {
    ...tsconfigRollupOrig,
    // ...tsOptions,
    // emitDeclarationOnly: true,
    // esModuleInterop: true,
    // strict: false,
    // allowJs: false,
    // noEmit: true,
    // checkJs: false,
    // moduleResolution: "node",
    // // allowSyntheticDefaultImports: false,
    // // experimentalDecorators: false,
    // // emitDecoratorMetadata: false,
    // // downlevelIteration: false,
    // resolveJsonModule: false,
    // rootDir: "src",

  target: "ESNext",
  module: "ESNext",

    "esModuleInterop": false,
    "strict": false,
    "allowJs": true,
    "noEmit": true,
    "checkJs": false,
    "resolveJsonModule": true,
    // "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "downlevelIteration": true,
 }
}


// delete dtsOptions.compilerOptions.moduleResolution
// console.log("tsOptionsUmd", tsOptionsUmd)
const dist = {
  input: "src/index.js",
  plugins: [...plugins, ts(tsOptionsDist)],
  output: [
    {
      dir: "dist/esm",
      format: "esm",
      sourcemap: true,
    },
    {
      dir: "dist/cjs",
      format: "cjs",
      sourcemap: true,
    }
  ],
}
const outputUmd = {
  format: "umd",
  name: "MovieMasher",
  exports: "named",
  esModule: false,
}
const umd = {
  input: "src/index.umd.js",
  plugins: [...plugins, ts({ tsconfig: {
    ...tsconfigRollupOrig,
    declarationMap: true,
    declaration: true,
  } })],
  output: {
    ...outputUmd,
    file: "dist/moviemasher.js",
    // plugins: [flatDts(dtsOptions)],
  }
}

const terse = {
  input: "src/index.umd.js",
  plugins: [...plugins, ts(tsOptionsDist)],
  output: {
    ...outputUmd,
    sourcemap: true,
    file: "dist/moviemasher.min.js",
    plugins: [terser()]
  }
}//
export default [dist, umd, terse]
