import ts from "rollup-plugin-ts"
import json from "@rollup/plugin-json"

export default {
  input: 'src/index.ts',
  output: { 
    format: 'umd', interop: 'auto', 
    file: 'umd/moviemasher.js', name: 'MovieMasher' 
  },
  plugins: [
    json({ preferConst: true, indent: '  ', namedExports: true }),
    ts({ tsconfig: {
      target: 'ESNext',
      resolveJsonModule: true, 
      allowSyntheticDefaultImports: true,
      declaration: true,
      declarationMap: true,
    } })
  ],
}
