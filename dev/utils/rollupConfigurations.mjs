import path from 'path'
import fs from 'fs'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import typescript from "rollup-plugin-typescript2"
// import ts from "rollup-plugin-ts"


import { monoDir } from './file.mjs'
import { expandImportsPlugin } from './expandImportsPlugin.mjs'

const rootDir = monoDir()

export const rollupClient = (args) => {
  return rollupConfiguration({ ...args, format: 'umd' })
}

export const rollupPackage = (args) => {
  return rollupConfiguration({ ...args, format: 'esm', package: true })
}


export const rollupIife = (args) => {
  return rollupConfiguration({ ...args, format: 'iife' })
}

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
  
  // const isPackage = outputExtension === 'mjs'

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
      '@moviemasher/client-react': 'MovieMasherClient',
      '@moviemasher/client-core': 'MovieMasherClientCore',
      '@moviemasher/protocol-supabase': 'MovieMasherProtocolSupabase',
      '@moviemasher/theme-default': 'MovieMasherTheme',
      '@moviemasher/lib-core': 'MovieMasher',
      '@supabase/supabase-js': 'supabase',
    },
  }
  if (isPackage) {
    // sharedOutput.entryFileNames = chunkInfo => {
    //   let name = chunkInfo.name
    //   if (name === 'index' && preserveModules) name = libName
    //   const extended = `${name}.${outputExtension}`
    //   console.log('entryFileNames', chunkInfo.name, '->', extended)

    //   return extended
    // },
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
      // module: modulesByFormat[format] || format,
      // composite: true,
      // inlineSources: false,
      // // isolatedModules: false,
      ...tsOverride, 
    },
    include: [
      // `${argsSrc}/**/*.ts`, 
      `${argsSrc}/*.ts`
    ],
    exclude: [
      "**/node_modules/**/*"],
  }
  const typescriptConfig = { 
    // verbosity: 3,
    cacheRoot: `${rootDir}/node_modules/.cache/rollup-plugin-typescript2`,
    tsconfigOverride,
    tsconfig: fileName,
  }
  
  // const tsConfig = {
  //   tsconfig: {
  //     fileName,
  //     hook: baseConfig => ({ ...baseConfig, ...tsconfigOverride })
  //   }
  // }

  const plugins = [ 
    // json({ preferConst: true, indent: '  ', namedExports: true }),

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
   
    
    // ts(tsConfig),
  ]
  if (isPackage) plugins.push(expandImportsPlugin())
  // console.log('tsconfig', tsconfigOverride)
  // if (!isPackage) {
    // plugins.unshift(importMapsPlugin({
    //   transformingReport: `${outputDir}/import-map-report.json`,
    //   // noTransforming: true,
    //   ,
    // }))
    // plugins.push(terser())
  // }
  const output = { ...sharedOutput }

  const configuration = {...sharedConfiguration, plugins, output }

  // console.log(JSON.stringify(configuration, null, 2))

  return configuration
}
