import path from 'path'
import ts from "rollup-plugin-ts"
import copy from 'rollup-plugin-copy'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import pkg from "../package.json"

const { source, browser } = pkg

const publicDir = path.dirname(browser)
const privateDir = path.dirname(publicDir)
export default {
  input: source,
  output: {
    file: browser,
    format: "iife",
    sourcemap: false,
    globals: { 
      react: 'React',
      'react-dom/client': 'ReactDOM',
      '@moviemasher/client-react': 'MovieMasherClient',
      '@moviemasher/moviemasher.js': 'MovieMasher',
    },
  },
  plugins: [
    peerDepsExternal(),
    copy({
      targets: [
        { src: 'src/server-config.json', dest: privateDir },
        { src: 'src/data-migrations', dest: privateDir },
        { src: '../../dev/img/*', dest: publicDir },
      ]
    }),
    ts({ tsconfig: './dev/client.tsconfig.json' }),
  ]
}
