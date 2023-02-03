import resolve from '@rollup/plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'

export default {
  input: 'cjs/server-express.js',
  output: {
    file: 'cjs/server-express.min.js',
    format: "cjs",
    sourcemap: false,
    name: "MovieMasherServer"
  },
  plugins: [
    peerDepsExternal(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.FLUENTFFMPEG_COV': false
    }),
    resolve(),
    commonjs({ exclude: '**/*.node', include: /node_modules/ }),
    terser()
  ]
}
