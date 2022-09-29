import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import ts from 'rollup-plugin-ts'

import pkg from '../../package.json'

const { module, source } = pkg

export default {
  input: source,
  output: { format: 'esm', file: module },
  plugins: [
    peerDepsExternal(),
    ts({ tsconfig: './dev/tsconfig.json' })
  ]
}
