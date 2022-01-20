import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import json from "@rollup/plugin-json"
import ts from "rollup-plugin-ts"
import pkg from "./package.json"
import path from 'path'

const { main, types } = pkg
const jsonOptions = { preferConst: true, indent: "  ", namedExports: true }

export default {
  input: "./index.ts",
  output: {
    file: main,
    format: "esm",
  },
  plugins: [
    json(jsonOptions),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.FLUENTFFMPEG_COV': false
    }),
    resolve({preferBuiltins: true}),
    commonjs({ exclude: '*.node', include: /node_modules/ }),
    ts({
      hook: {
        outputPath: (_, kind) => {
          if (kind === "declaration") return path.resolve(types)
        }
      },
    }),
  ]
}
