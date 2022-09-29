import resolve from '@rollup/plugin-node-resolve'
import ts from "rollup-plugin-ts"
import peerDepsExternal from 'rollup-plugin-peer-deps-external'


import pkg from "../../package.json"

const { source, module } = pkg

export default {
  input: source,
  context: 'globalThis.window',
  output: { format: 'esm', file: module },
  plugins: [
    peerDepsExternal(), 
    resolve(), 
    ts({ tsconfig: './dev/tsconfig.json' })
  ]
}
