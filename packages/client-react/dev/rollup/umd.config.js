import ts from "rollup-plugin-ts"
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

import pkg from "../../package.json"

const { source, browser } = pkg

export default {
  input: source,
  output: { 
    format: 'umd', file: browser, name: 'MovieMasherClient', 
    globals: { 
      react: 'React',
      '@moviemasher/theme-default': 'MovieMasherTheme',
      '@moviemasher/moviemasher.js': 'MovieMasher',
    },
  },
  plugins: [
    peerDepsExternal(),
    ts({ tsconfig: './dev/tsconfig.json' })
  ]
}
