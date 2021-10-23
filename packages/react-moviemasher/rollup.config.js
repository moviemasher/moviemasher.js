import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import css from 'rollup-plugin-css-only'
// import copy from 'rollup-plugin-copy'
import replace from '@rollup/plugin-replace'
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import ts from "rollup-plugin-ts"
import pkg from "./package.json"

export default {
  input: "./index.ts",
  output: {
    // dir: outputDir,
    format: "esm",
    file: pkg.module,
    sourcemap: true,
  },
  plugins: [
    peerDepsExternal(),
    // css({ output: 'moviemasher.css' }),
    // svg({ base64: true }),
    resolve(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify( 'development' )
    }),
    commonjs({ include: /node_modules/ }),
    ts(),
    // copy({
    //   targets: [
    //     { src: './index.html', dest: outputDir },
    //     { src: '../../develop/Assets/favicon.png', dest: outputDir, rename: 'favicon.ico' }
    //   ]
    // })
  ]
}
