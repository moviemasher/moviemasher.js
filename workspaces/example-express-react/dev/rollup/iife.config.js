import path from 'path'
import ts from "rollup-plugin-ts"
import copy from 'rollup-plugin-copy'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
// import fs from 'fs'
// import resolve from '@rollup/plugin-node-resolve'
// import commonjs from '@rollup/plugin-commonjs'
// import replace from '@rollup/plugin-replace'
// import css from 'rollup-plugin-css-only'
// import json from "@rollup/plugin-json"


import pkg from "../../package.json"

const { source, browser } = pkg

// const replaceOptions = {
//   preventAssignment: true,
//   'process.env.NODE_ENV': JSON.stringify( 'production' )
// }

const publicDir = path.dirname(browser)
const privateDir = path.dirname(publicDir)
export default {
  input: source,
  output: {
    file: browser,
    format: "iife",
    sourcemap: false,
    globals: { 
      react: 'React',
      'react-dom/client': 'ReactDOM',
      '@moviemasher/client-react': 'MovieMasherClient',
      '@moviemasher/moviemasher.js': 'MovieMasher',
    },
  },
  plugins: [
    copy({
      targets: [
        { src: 'src/server-config.json', dest: privateDir },
        { src: 'src/data-migrations', dest: privateDir },
        {
          src: 'src/index.html',
          dest: publicDir,
          transform: buffer => {
            const replacements = [
              ['react.development.js', 'react.production.js'],
              ['react-dom.development.js', 'react-dom.production.js'],
              ['moviemasher.js', 'https://unpkg.com/@moviemasher/moviemasher.js/@5.1.0/umd/moviemasher.js'],
              ['theme-default.js', 'https://unpkg.com/@moviemasher/theme-default/@5.1.0/umd/theme-default.js'],
              ['client-react.js', 'https://unpkg.com/@moviemasher/client-react.js/@5.1.0/umd/client-react.js'],
              ['moviemasher.css', 'https://unpkg.com/@moviemasher/theme-default/@5.1.0/moviemasher.css']
            ]
            let string = buffer.toString()
            replacements.forEach(([find, replace]) => {
              string = string.replace(find, replace)
            })
            return string
          },
        },
        { src: '../../dev/img/*', dest: publicDir },
      ]
    }),
    peerDepsExternal(),
    // resolve(),
    // replace(replaceOptions),
    // json( { preferConst: true, indent: "  ", namedExports: true }),
    // commonjs({ include: /node_modules/ }),
    
    ts({ tsconfig: './dev/client.tsconfig.json' }),
    // css({ output: `${name}.css` }),
    
    // terser(),
  ]
}
