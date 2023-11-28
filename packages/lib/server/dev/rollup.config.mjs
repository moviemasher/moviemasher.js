import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import { monoDir } from '../../../../dev/utils/file.mjs'
import terser from '@rollup/plugin-terser'

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
    dir: 'dist', sourcemap: true,
  },
  // context: 'globalThis.window',
  external: [
    /@moviemasher/, 
    'fluent-ffmpeg',
    'ttf2woff2',
    'child_process',
    'util',
    'path',
    'fs',
    'events',
    'stream',
    'stream/promises',
    'crypto',
  ],
  plugins: [ 
    resolve(), typescript(typescriptConfig), terser(),
  ],
}
