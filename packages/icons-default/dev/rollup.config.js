import resolve from '@rollup/plugin-node-resolve'
import ts from "rollup-plugin-ts"
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default {
  context: 'this',
  input: 'src/index.ts',
  output: { file: `./dist/index.js`, format: 'esm' },
  plugins: [
    peerDepsExternal(),
    resolve(),
    ts({ tsconfig: './dev/tsconfig.json' }),
  ]
}
