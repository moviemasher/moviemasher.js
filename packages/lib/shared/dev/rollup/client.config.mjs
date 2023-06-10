import path from 'path'
import terser from '@rollup/plugin-terser'
import typescript from 'rollup-plugin-typescript2'

import { monoDir } from '../../../../../dev/utils/file.mjs'

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
    file: 'dist/lib-shared.js'
  },

  external: [
    '@moviemasher/runtime-shared',
    '@moviemasher/runtime-client',
    '@moviemasher/runtime-server',
  ],
  plugins: [
    typescript(typescriptConfig),
    // terser(),
  ],
}