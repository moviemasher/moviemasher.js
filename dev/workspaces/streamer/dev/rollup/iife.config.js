import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import ts from "rollup-plugin-ts"
import css from 'rollup-plugin-css-only'
import pkg from "../../package.json"

const { main } = pkg

export default {
  input: "./index.jsx",
  output: {
    file: main,
    format: "iife",
    name: "ReactMovieMasher",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    }),
    commonjs({ include: /node_modules/ }),
    ts(),
    css({ output: 'moviemasher.css' }),
  ]
}
