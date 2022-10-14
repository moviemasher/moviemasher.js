import { terser } from 'rollup-plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

import pkg from "../../package.json"

const { module } = pkg

export default {
  input: module,
  output: { 
    format: 'umd', file: 'umd/client-react.min.js', name: 'MovieMasherClient', 
    globals: { 
      react: 'React',
      '@moviemasher/theme-default': 'MovieMasherTheme',
      '@moviemasher/moviemasher.js': 'MovieMasher',
    },
  },
  plugins: [peerDepsExternal(), terser()]
}
