import path from 'path'

const framework = 'component'

import terser from '@rollup/plugin-terser'
import typescript from 'rollup-plugin-typescript2'

import { monoDir } from '../../../../../dev/utils/file.mjs'
// import { expandImportsPlugin } from '../../../../../dev/utils/expandImportsPlugin.mjs'

const projectDir = monoDir()
const rootDir = path.resolve('src')
const declaration = false
const typescriptConfig = { 
  cacheRoot: `${projectDir}/node_modules/.cache/rollup-plugin-typescript2`,
  tsconfigOverride: { 
    compilerOptions: { rootDir, declaration, declarationMap: declaration },
    include: [`${rootDir}/*.ts`],
  },
  tsconfig: `./tsconfig.json`,
}

export default {
  input: 'src/index.ts',
  output: {
    format: 'esm',
    file: 'dist/lib-client.js'
  },
  external: [/moviemasher/, /lit/, /tslib/],
  context: 'globalThis.window',
  plugins: [
    typescript(typescriptConfig),
    // expandImportsPlugin(),
    // terser(),
  ],
}
