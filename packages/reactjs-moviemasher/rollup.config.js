import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-only'
import copy from 'rollup-plugin-copy'
import replace from '@rollup/plugin-replace';
import svg from 'rollup-plugin-svg'
import ts from "rollup-plugin-ts"

const outputDir = 'public'

export default {
  input: "src/index.tsx",
  output: {
    dir: outputDir,
    format: "iife",
    name: "ReactMovieMasher",
    sourcemap: true,
  },
  plugins: [
    css({ output: 'moviemasher.css' }),
    svg({ base64: true }),
    resolve(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify( 'development' )
    }),
    commonjs({ include: /node_modules/ }),
    ts(),
    copy({
      targets: [
        { src: './index.html', dest: outputDir },
        { src: '../../develop/Assets/favicon.png', dest: outputDir, rename: 'favicon.ico' }
      ]
    }),
    // serve({
    //   open: true,
    //   verbose: false,
    //   contentBase: ["", outputDir],
    //   host: "localhost",
    //   port: 7996,
    // }),
    // livereload({ watch: outputDir }),
  ]
}
