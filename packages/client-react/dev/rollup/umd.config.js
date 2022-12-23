import ts from "rollup-plugin-ts"
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

import pkg from "../../package.json"

const { main } = pkg

export default {
  input: 'src/index.ts',
  output: { 
    format: 'umd', file: main, name: 'MovieMasherClient', 
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
