import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import ts from "rollup-plugin-ts"
import css from 'rollup-plugin-css-only'

import pkg from "../../package.json"

const { main, source } = pkg


const replaceOptions = {
  preventAssignment: true,
  'process.env.NODE_ENV': JSON.stringify( 'development' )
}

export default {
  input: source,
  output: {
    format: "iife",
    file: main,
    sourcemap: false,
  },
  plugins: [
    resolve(),
    replace(replaceOptions),
    commonjs({ include: /node_modules/ }),
    ts({tsconfig: './dev/tsconfig.json'}),
    css({ output: 'index.css' }),
    terser()
  ]
}
