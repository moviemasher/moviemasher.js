import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import ts from "rollup-plugin-ts"
import pkg from "../../package.json"

const { main } = pkg

export default {
  input: "./index.ts",
  output: {
    file: main,
    format: "esm",
    name: "ReactMovieMasher",
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.FLUENTFFMPEG_COV': false
    }),
    resolve(),
    commonjs({ exclude: '*.node', include: /node_modules/ }),
    ts(),
  ]
}
