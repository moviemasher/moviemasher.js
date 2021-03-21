//import commonjs from "@rollup/plugin-commonjs"
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";

// import copy from 'rollup-plugin-copy'
import url from 'rollup-plugin-url'

const input = ["src/index.js"];
const url_options = {
  // by default, rollup-plugin-url will not handle font files
  include: ['**/*.woff', '**/*.woff2'],
  // setting infinite limit will ensure that the files 
  // are always bundled with the code, not copied to /dist
  limit: Infinity,
}

const resolve_options = { browser:true, preferBuiltins: true }
export default [
  {
    // UMD
    input,
    plugins: [
      nodeResolve(resolve_options),
      url(url_options),
      babel({ babelHelpers: "bundled", }),
      terser(),
    ],
    output: {
      file: `dist/moviemasher.min.js`,
      format: "umd",
      name: "MovieMasher", // this is the name of the global object
      esModule: false,
      exports: "named",
      sourcemap: true,
    },
  },
// ESM and CJS
  {
    input,
    plugins: [
      nodeResolve(),
      url(url_options),
    ],
    output: [
      {
        dir: "dist/esm",
        format: "esm",
        exports: "named",
        sourcemap: true,
      },
      {
        dir: "dist/cjs",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
    ],
  },
];