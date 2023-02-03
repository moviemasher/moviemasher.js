import terser from '@rollup/plugin-terser'
import ts from "rollup-plugin-ts"
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default {
  input: 'esm/client-core.js',
  output: { 
    format: 'umd', file: 'umd/client-core.min.js', name: 'MovieMasherCore', 
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
    } }),
    terser()
  ]
}
