import resolve from '@rollup/plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import ts from "rollup-plugin-ts"
import pkg from "./package.json"
import path from 'path'

const { main } = pkg

export default {
  input: "./index.ts",
  output: {
    file: main,
    format: "cjs",
  },
  plugins: [
    peerDepsExternal(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.FLUENTFFMPEG_COV': false
    }),
    resolve(),
    commonjs({ exclude: '**/*.node', include: /node_modules/ }),
    ts({
      hook: {
        outputPath: (_, kind) => {
          if (kind === "declaration") return path.resolve(pkg.types)
        }
      }
    }),
  ]
}
