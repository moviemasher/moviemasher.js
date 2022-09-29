import ts from "rollup-plugin-ts"
import json from "@rollup/plugin-json"

import pkg from "../../package.json"

const { source, main } = pkg

export default {
  input: source,
  output: { format: 'umd', file: main, name: 'MovieMasher' },
  plugins: [
    json({ preferConst: true, indent: '  ', namedExports: true }),
    ts({ tsconfig: './dev/tsconfig.json' })
  ],
}
