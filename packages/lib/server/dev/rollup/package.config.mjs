import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import { monoDir } from '../../../../../dev/utils/file.mjs'

const projectDir = monoDir()
const rootDir = path.resolve('src')
const declaration = true

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
    preserveModules: true,
    preserveModulesRoot: rootDir,
    dir: 'dist'
  },
  // context: 'globalThis.window',
  external: [
    '@moviemasher/lib-shared',
    '@moviemasher/runtime-shared',
    '@moviemasher/runtime-server',
    'fluent-ffmpeg',
    'ttf2woff2',
    'child_process',
    'path',
    'fs',
    'events',
    'http',
    'https',
    'crypto',
  ],
  plugins: [ 
    typescript(typescriptConfig),
  ],
}