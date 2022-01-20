import path from 'path'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import ts from 'rollup-plugin-ts'
import pkg from './package.json'

export default {
  input: './index.ts',
  output: {
    format: 'esm',
    file: pkg.module,
    sourcemap: true,
  },
  plugins: [peerDepsExternal(), ts({
    hook: {
      outputPath: (_, kind) => {
        if (kind === "declaration") return path.resolve(pkg.types)
      }
    },
  })]
}
