import ts from "rollup-plugin-ts"
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default {
  input: 'src/client.tsx',
  output: {
    file: 'public/client.js',
    format: "iife",
    sourcemap: false,
    globals: { 
      'react': 'React',
      'react-dom/client': 'ReactDOM',
      '@moviemasher/client-react': 'MovieMasherClient',
      '@moviemasher/moviemasher.js': 'MovieMasher',
    },
  },
  plugins: [
    peerDepsExternal(),
    ts({ tsconfig: './dev/client.tsconfig.json' }),
  ]
}
