import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import { monoDir } from '../../../../dev/utils/file.mjs'
import copy from 'rollup-plugin-copy'

const projectDir = monoDir()
const rootDir = path.resolve('src')
const declaration = true

const typescriptConfig = { 
  cacheRoot: `${projectDir}/node_modules/.cache/rollup-plugin-typescript2`,
  tsconfigOverride: { 
    compilerOptions: { rootDir, declaration, declarationMap: declaration },
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
  external: [
    /^@moviemasher/, 
    /^sqlite/,
    'express-basic-auth',
    'multer',
    'express',
    'cors',
    'pg',
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
    copy({ targets: [
      { src: 'src/html/*', dest: 'dist/public' },
      { src: 'src/img/*', dest: 'dist/public' },
    ] }),

    typescript(typescriptConfig),
  ],
}

