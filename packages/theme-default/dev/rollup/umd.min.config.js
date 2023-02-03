import terser from '@rollup/plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default {
  input: 'esm/theme-default.js',
  context: 'globalThis.window',
  output: { 
    format: 'umd', file: 'umd/theme-default.min.js', name: 'MovieMasherTheme', 
    globals: { react: 'React' },
  },
  plugins: [peerDepsExternal(), terser()],
}
