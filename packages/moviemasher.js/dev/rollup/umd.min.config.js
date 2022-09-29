import { terser } from 'rollup-plugin-terser'

import pkg from '../../package.json'

const { module } = pkg

export default {
  input: module,
  output: { 
    format: 'umd', file: 'umd/moviemasher.min.js', name: 'MovieMasher'
  },
  plugins: [terser()],
}
