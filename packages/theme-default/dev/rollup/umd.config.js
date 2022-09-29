import resolve from '@rollup/plugin-node-resolve'
import ts from "rollup-plugin-ts"
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

import pkg from "../../package.json"

const { source, main } = pkg

export default {
  input: source,
  context: 'globalThis.window',
  output: { 
    format: 'umd', file: main, name: 'MovieMasherTheme', 
    globals: { react: 'React' },
  },
  plugins: [
    peerDepsExternal(),
    resolve(),
    ts({ tsconfig: './dev/tsconfig.json' })
  ]
}
