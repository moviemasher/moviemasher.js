import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import { monoDir } from '../../../../dev/utils/file.mjs'
import terser from '@rollup/plugin-terser'
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
    indent: '  ',
    preserveModules: true,
    preserveModulesRoot: rootDir,
    dir: 'dist', sourcemap: true,
  },
  context: 'globalThis.window',
  external: [/@moviemasher/, /^@?lit/],
  plugins: [
    copy({ targets: [
      { src: 'src/index.html', dest: 'dist/public' },
      { src: ['assets/fonts/arial.woff', 'assets/fonts/arial.woff2'], dest: 'dist/public/fonts' },
      { src: 'src/json/*', dest: 'dist/json' }
    ]}),
    typescript(typescriptConfig), terser()
  ],
}

