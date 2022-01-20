import path from 'path'
import fs from 'fs'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import ts from "rollup-plugin-ts"
import css from 'rollup-plugin-css-only'
import copy from 'rollup-plugin-copy'

const dest = './dist'
const outputExtension = '.js'
const inputExtension = '.tsx'
const allFiles = fs.readdirSync(path.resolve('./'))
const files = allFiles.filter(file => path.extname(file) === inputExtension)
const names = files.map(file => path.basename(file, inputExtension))

const replaceOptions = {
  preventAssignment: true,
  'process.env.NODE_ENV': JSON.stringify( 'development' )
}

export default names.map(name => ({
  input: `./${name}${inputExtension}`,
  output: {
    file: path.join(dest, `${name}${outputExtension}`),
    format: "iife",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    replace(replaceOptions),
    commonjs({ include: /node_modules/ }),
    ts({ tsconfig: '../../config/tsconfig.json' }),
    css({ output: `${name}.css` }),
    copy({
      targets: [{
        src: '../../index.html',
        dest,
        rename: () => `${name}.html`,
        transform: buffer => {
          const string = buffer.toString()
          const jsReplaced = string.replace('index.js', `${name}${outputExtension}`)
          const cssReplaced = jsReplaced.replace('index.css', `${name}.css`)
          return cssReplaced
        },
      }]
    }),
  ]
}))
