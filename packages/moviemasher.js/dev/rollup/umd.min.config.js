import { terser } from 'rollup-plugin-terser'

import pkg from '../../package.json'

const { module, main } = pkg

export default {
  input: module,
  output: { format: 'umd', file: main, name: 'MovieMasher' },
  plugins: [terser()],
}
