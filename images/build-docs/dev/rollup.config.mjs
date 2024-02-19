import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import { fileURLToPath } from 'url'

const projectDir = path.resolve(fileURLToPath(import.meta.url), '../../../../')
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
    preserveModules: false,
    preserveModulesRoot: rootDir,
    file: 'dist/index.mjs',
  },
  external: [
    /^@moviemasher/, 
    'marked',
    'path',
    'fs',
    'crypto',
    'markdown-magic',
    'shiki',
  ],
  plugins: [ 
    typescript(typescriptConfig),
  ],
}

