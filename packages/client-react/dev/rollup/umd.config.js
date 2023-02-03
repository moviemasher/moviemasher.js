import ts from "rollup-plugin-ts"
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default {
  input: 'src/index.ts',
  output: { 
    format: 'umd', interop: 'auto', 
    file: 'umd/client-react.js', name: 'MovieMasherClient', 
    globals: { 
      'react': 'React',
      '@moviemasher/theme-default': 'MovieMasherTheme',
      '@moviemasher/moviemasher.js': 'MovieMasher',
      '@moviemasher/client-core': 'MovieMasherCore',
    },
  },
  plugins: [
    peerDepsExternal(),
    ts({ tsconfig: { 
      target: 'ESNext', 
      resolveJsonModule: true, 
      allowSyntheticDefaultImports: true,
      jsx: 'react',
      declaration: true,
      declarationMap: true,
    } }),
  ]
}
