import { terser } from 'rollup-plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

import pkg from "../../package.json"

const { module } = pkg

export default {
  input: module,
  context: 'globalThis.window',
  output: { 
    format: 'esm', file: 'esm/theme-default.min.js', name: 'MovieMasherTheme', 
    globals: { react: 'React' },
  },
  plugins: [peerDepsExternal(), terser()],
}
