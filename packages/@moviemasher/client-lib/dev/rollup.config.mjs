import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import { fileURLToPath } from 'url'
import copy from 'rollup-plugin-copy'

const projectDir = path.resolve(fileURLToPath(import.meta.url), '../../../../../')
const rootDir = path.resolve('src')
const declaration = true

const typescriptConfig = { 
  cacheRoot: `${projectDir}/node_modules/.cache/rollup-plugin-typescript2`,
  tsconfigOverride: { 
    compilerOptions: { rootDir, declaration, declarationMap: declaration },
  },
  tsconfig: `./tsconfig.json`,
}

const config = {
  input: 'src/index.ts',
  output: {
    format: 'esm',
    indent: '  ',
    preserveModules: true,
    preserveModulesRoot: rootDir,
    dir: 'dist', sourcemap: true,
  },
  context: 'globalThis.window',
  external: [/^@moviemasher/, /^@?lit/],
  plugins: [
    // resolve(),
    typescript(typescriptConfig), 
    // terser(),
    copy({ targets: [{ src: 'src/json/*', dest: 'dist/json' }] }),
  ],
}

export default config
