import ts from "rollup-plugin-ts"
import json from "@rollup/plugin-json"

export default {
  input: 'src/index.ts',
  output: { format: 'umd', file: 'umd/moviemasher.js', name: 'MovieMasher' },
  plugins: [
    json({ preferConst: true, indent: '  ', namedExports: true }),
    ts({ tsconfig: 'dev/tsconfig.json' })
  ],
}
