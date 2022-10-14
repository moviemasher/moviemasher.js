import { terser } from 'rollup-plugin-terser'

import pkg from '../../package.json'

const { module } = pkg

export default {
  input: module,
  output: { 
    format: 'esm', file: 'esm/moviemasher.min.js', name: 'MovieMasher'
  },
  plugins: [terser()],
}
