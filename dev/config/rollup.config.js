
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import ts from "rollup-plugin-ts"
import css from 'rollup-plugin-css-only'

const replaceOptions = {
  preventAssignment: true,
  'process.env.NODE_ENV': JSON.stringify( 'development' )
}


export default {
  output: {
    format: "iife",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    replace(replaceOptions),
    commonjs({ include: /node_modules/ }),
    ts({tsconfig: '../../dev/config/tsconfig.json'}),
    css({ output: 'index.css' }),
  ]
}
