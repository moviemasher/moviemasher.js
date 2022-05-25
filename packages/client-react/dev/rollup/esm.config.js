import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import ts from 'rollup-plugin-ts'
import pkg from '../../package.json'


const { peerDependencies, module, source } = pkg

export default {
  external: Object.keys(peerDependencies),
  input: source,
  output: { format: "esm", file: module, sourcemap: false },
  plugins: [
    peerDepsExternal(),
    ts({ tsconfig: "./dev/tsconfig.json" }),
  ]
}
