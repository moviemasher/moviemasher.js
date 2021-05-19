/* eslint-disable import/no-anonymous-default-export */
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import svg from 'rollup-plugin-svg'
import html from '@rollup/plugin-html'
//  {
//   input: 'src/index.html',
//   output: { dir: 'public' },
//   plugins: [],
// },
const bableOptions = {
  presets: [
    ["@babel/preset-env", { "modules": false, "targets": { "node": "current" } }],
    "@babel/react"
  ],
  babelHelpers: "bundled",
}
const replaceOptions = {
  preventAssignment: true,
  'process.env.NODE_ENV': JSON.stringify( 'development' )
}
const resolveOptions = {
  extensions: [".js", ".jsx"],
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
    nodeResolve(resolveOptions),
    replace(replaceOptions),
    babel(bableOptions),
    commonjs(),
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

