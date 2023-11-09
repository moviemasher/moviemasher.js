import path from 'path'
import fs from 'fs'

import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import typescript from "rollup-plugin-typescript2"


import { monoDir } from './file.mjs'
import { expandImportsPlugin } from './expandImportsPlugin.mjs'

const rootDir = monoDir()

// const rollupClient = (args) => {
//   return rollupConfiguration({ ...args, format: 'umd' })
// }

// const rollupPackage = (args) => {
//   return rollupConfiguration({ ...args, format: 'esm', package: true })
// }


// const rollupIife = (args) => {
//   return rollupConfiguration({ ...args, format: 'iife' })
// }

const tsconfigPath = srcPath => {
  const parent = path.dirname(srcPath)
  if (parent === rootDir || rootDir.startsWith(parent)) {
    return path.resolve(rootDir, 'dev/tsconfig/base.json')
  } 


  const tsconfig = path.resolve(parent, 'tsconfig.json')
  if (fs.existsSync(tsconfig)) return tsconfig
  return tsconfigPath(parent)
}

export const rollupConfiguration = (args) => {
  const { 
    src: argsSrc,
    name, libName, 
    format, 
    input, 
    output: argsOutput = '', 
    inputExtension = 'ts',
    outputExtension = 'js',
    tsOverride = {},
  } = args

  const isPackage = format === 'esm'
  const outputDir = argsOutput || format
  
  const src = input || `index.${inputExtension}`
  const externalPrefixes = ['react-dom']
  const externals = ['@supabase/supabase-js', 'react']
  const internalPrefixes = ['.', '/', 'src/', 'react-icons/', 'svelte']
  const internals = ['react/jsx-runtime', '@supabase/auth-ui-react']
  if (isPackage) internals.push('@lit', 'tslib')
  else internalPrefixes.push('@lit', 'tslib')

  const sharedConfiguration = {
    input: `src/${src}`,
    context: 'globalThis.window',
    external: (id, consumer, isResolved) => {
      // console.log('EXTERNAL', id, consumer, isResolved);
    
      if (internalPrefixes.some(prefix => id.startsWith(prefix))) return false
      if (internals.includes(id)) return false
      if (externalPrefixes.some(prefix => id.startsWith(prefix))) return true
      if (externals.includes(id)) return true
      
      if (id.includes('@moviemasher')) {
        // console.log('EXTERNAL', isPackage, id, consumer)
        return !isPackage// true
      }

      if (!consumer) return false

      if (internals.some(internal => consumer.includes(internal))) return false
      // console.log('EXTERNAL', id, consumer)
      return isPackage
    },
   
  }


  const sharedOutput = { 
    format,
    exports: 'named',
    interop: 'auto', 
    preserveModules: isPackage,
    name, 
    globals: {
      'react': 'React',
      'react-dom/client': 'ReactDOM',
      '@moviemasher/lib-client': 'MovieMasherClient',
      '@moviemasher/lib-client': 'MovieMasherClientCore',
      '@moviemasher/protocol-supabase': 'MovieMasherProtocolSupabase',
      '@moviemasher/theme-default': 'MovieMasherTheme',
      '@moviemasher/lib-shared': 'MovieMasher',
      '@supabase/supabase-js': 'supabase',
    },
  }
  if (isPackage) {
    sharedOutput.dir = outputDir
    sharedOutput.preserveModulesRoot = 'src'
  } else {
    sharedOutput.file = `${outputDir}/index.${outputExtension}`
  }

  const fileName = tsconfigPath(argsSrc)

  const tsconfigOverride = { 
    compilerOptions: {
      declaration: isPackage, declarationMap: isPackage, 
      rootDir: argsSrc,
      ...tsOverride, 
    },
    include: [`${argsSrc}/*.ts`],
    exclude: ["**/node_modules/**/*"],
  }
  const typescriptConfig = { 
    cacheRoot: `${rootDir}/node_modules/.cache/rollup-plugin-typescript2`,
    tsconfigOverride,
    tsconfig: fileName,
  }
  
  const plugins = [ 
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.FLUENTFFMPEG_COV': false,
      }
    }),
    commonjs({ exclude: '**/*.node', include: /node_modules/ }),
    nodeResolve({
      include: [/node_modules/],
      extensions: ['.mjs', '.js', '.jsx'],
    }),
    typescript(typescriptConfig),
  ]
  if (isPackage) plugins.push(expandImportsPlugin())

  const output = { ...sharedOutput }
  const configuration = {...sharedConfiguration, plugins, output }

  console.log(JSON.stringify(configuration, null, 2))

  return configuration
}
