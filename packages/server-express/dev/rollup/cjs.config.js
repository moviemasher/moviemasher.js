
import resolve from '@rollup/plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import ts from "rollup-plugin-ts"
import pkg from "../../package.json"

const { main, source } = pkg

export default {
  input: source,
  output: {
    file: main,
    format: "cjs",
    sourcemap: true,
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
    ts({ tsconfig: "./dev/tsconfig.json" }),
  ]
}
