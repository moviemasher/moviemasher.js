import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import { fileURLToPath } from 'url'

const projectDir = path.resolve(fileURLToPath(import.meta.url), '../../../../../')
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

const config = {
  input: 'src/index.ts',
  output: {
    format: 'esm',
    preserveModules: true,
    preserveModulesRoot: rootDir,
    dir: 'dist', sourcemap: true,
  },
  external: [
    /^@moviemasher/, 
    'fluent-ffmpeg',
    'ttf2woff2',
    'child_process',
    'util',
    'path',
    'fs',
    'events',
    'stream',
    'jsdom',
    'stream/promises',
    'crypto',
    'canvas',
  ],
  plugins: [ 
    resolve(), typescript(typescriptConfig), 
    // terser(),
  ],
}

export default config
