import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
// import svg from 'rollup-plugin-svg'
import ts from "rollup-plugin-ts"
import pkg from "../../package.json"
import css from 'rollup-plugin-css-only'
// import path from 'path'

const { main } = pkg
// const outputDir = path.dirname(main)

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
