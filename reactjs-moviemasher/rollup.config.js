import serve from "rollup-plugin-serve"
import livereload from "rollup-plugin-livereload";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import svg from 'rollup-plugin-svg'
import html from '@rollup/plugin-html'
import ts from "@wessberg/rollup-plugin-ts"

const replaceOptions = {
  preventAssignment: true,
  'process.env.NODE_ENV': JSON.stringify( 'development' )
}

const htmlOptions = {
  title: "ReactJS Movie Masher",
  // template: () => "<div id='root'></div><script src='index.js'></script>"
}

export default [ {
  input: "src/index.js",
  output: {
    dir: "public",
    format: "iife",
    name: "ReactMovieMasher",
    sourcemap: true,
  },
  plugins: [
    svg(),
    postcss({ plugins: [] }),
    resolve(),
    replace(replaceOptions),
    commonjs({ include: /node_modules/ }),
    ts(),
    html(htmlOptions),
    serve({
      open: true,
      verbose: true,
      contentBase: ["", "public"],
      host: "localhost",
      port: 3000,
    }),
    livereload({ watch: "public" }),
  ]
}];
