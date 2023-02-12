import ts from "rollup-plugin-ts"
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default {
  input: 'src/index.ts',
  output: { 
    format: 'umd', file: 'umd/client-core.js', name: 'MovieMasherClientCore', 
    globals: { 
      '@moviemasher/moviemasher.js': 'MovieMasher',
    },
  },
  plugins: [
    peerDepsExternal(),
    ts({ tsconfig: { 
      target: 'ESNext', 
      resolveJsonModule: true, 
      allowSyntheticDefaultImports: true,
      declaration: true,
      declarationMap: true,
    } }),
  ]
}
