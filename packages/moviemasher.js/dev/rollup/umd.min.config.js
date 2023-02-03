import ts from "rollup-plugin-ts"
import json from "@rollup/plugin-json"
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/index.ts',
  output: { 
    format: 'umd', interop: 'auto', 
    file: 'umd/moviemasher.min.js', name: 'MovieMasher' },
  plugins: [
    json({ preferConst: true, indent: '  ', namedExports: true }),
    ts({ tsconfig: {
      target: 'ESNext',
      resolveJsonModule: true, 
      allowSyntheticDefaultImports: true,
    } }),
    terser()
  ]
}
