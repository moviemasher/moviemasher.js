import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";
import json from '@rollup/plugin-json';
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const resolve_options = { browser:true, preferBuiltins: true }
const shared = {
  input: "src/index.js",
  //moduleContext: () => 'this',
}
export default [
  {
    ...shared,
    // UMD
    plugins: [
      json(),
      commonjs(),
      nodeResolve(resolve_options),
      babel({ babelHelpers: "bundled", }),
      //terser(),
    ],
    output: {
      file: `dist/moviemasher.min.js`,
      format: "umd",
      name: "MovieMasher", 
      esModule: false,
      // exports: "named",
      sourcemap: true,
    },

  },
  // ESM and CJS
  {
    ...shared,
    external,
    plugins: [
      json({ preferConst: true, indent: "  ", namedExports: false }),
      nodeResolve(),
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