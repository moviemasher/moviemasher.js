// import resolve from '@rollup/plugin-node-resolve'
// import commonjs from '@rollup/plugin-commonjs'
// import replace from '@rollup/plugin-replace'
// import svg from 'rollup-plugin-svg'
// import ts from "rollup-plugin-ts"
import pkg from "../../package.json"
// import css from 'rollup-plugin-css-only'
import path from 'path'
import serve from "rollup-plugin-serve"
// import livereload from "rollup-plugin-livereload"

const { main } = pkg
const outputDir = path.dirname(main)

// const livereloadPlugin = livereload({ watch: "src", verbosity: 'debug' })
export default {
  input: "./index.jsx",
  output: {
    file: main,
    format: "iife",
    name: "ReactMovieMasher",
    sourcemap: true,
  },
  plugins: [
    // svg({ base64: true }),
    // resolve(),
    // replace({
    //   preventAssignment: true,
    //   'process.env.NODE_ENV': JSON.stringify( 'development' )
    // }),
    // commonjs({ include: /node_modules/ }),
    // ts(),
    // css({ output: 'moviemasher.css' }),
    serve({
      open: true,
      verbose: true,
      contentBase: [outputDir, "../../../../assets/raw"],
      host: "localhost",
      port: 7977,
    }),
    // livereloadPlugin
  ]
}
