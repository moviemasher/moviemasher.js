import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import json from "@rollup/plugin-json"
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import typescript from "rollup-plugin-ts"

export const rollupConfigurations = (args) => {
  const { 
    name, libName, 
    formats = { umd: 'js', esm: 'mjs' }, 
    input, output, extension = 'ts'
  } = args
  
  const { BUILD_ONLY } = process.env
 
  const src = input || `index.${extension}`
  const internalPrefixes = ['.', '/', 'src/', 'react-icons/']
  const externalPrefixes = ['react-dom']
  const externals = ['@supabase/supabase-js', 'react']
  const internals = ['react/jsx-runtime', '@supabase/auth-ui-react']

  const sharedConfiguration = {
    input: `src/${src}`,
    context: 'globalThis.window',
    external: (id, consumer) => {
      if (internalPrefixes.some(prefix => id.startsWith(prefix))) return false
      if (internals.includes(id)) return false
      if (externalPrefixes.some(prefix => id.startsWith(prefix))) return true
      if (externals.includes(id)) return true
      if (id.includes('@moviemasher')) return true

      if (!consumer) return false

      if (internals.some(internal => consumer.includes(internal))) return false
      // console.log('EXTERNAL', id, consumer)
      return true
    }
  }
  const sharedPlugins = [
    nodeResolve(), 
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.FLUENTFFMPEG_COV': false,
      }
    }),
    commonjs({ exclude: '**/*.node', include: /node_modules/ }),//
    json({ preferConst: true, indent: '  ', namedExports: true }),
  ]
  const sharedTsconfig = {
    target: 'ESNext',
    resolveJsonModule: true, 
    allowSyntheticDefaultImports: true,
    declaration: false, declarationMap: false,
    lib: ["DOM", "ESNext", "ES2022"],
    // "isolatedModules": true,
    allowJs: extension === 'js',
    module: "ESNext",
    jsx: "react",
  }
  const sharedOutput = { 
    interop: 'auto', 
    name, 
    globals: {
      'react': 'React',
      'react-dom/client': 'ReactDOM',
      '@moviemasher/client-react': 'MovieMasherClient',
      '@moviemasher/client-core': 'MovieMasherClientCore',
      '@moviemasher/protocol-supabase': 'MovieMasherProtocolSupabase',
      '@moviemasher/theme-default': 'MovieMasherTheme',
      '@moviemasher/moviemasher.js': 'MovieMasher',
      '@supabase/supabase-js': 'supabase',
    } 
  }
  const configurations = []

  Object.entries(formats).forEach(([format, outputExtension]) => {
    let dir = output || format
    if (!dir.includes('/')) {
      dir += '/'
      if (input) dir += path.basename(input, path.extname(input))
      else dir += libName
    }
    const isModule = format === 'esm'
    
    if (!(isModule && (BUILD_ONLY === 'esm'))) {
      const plugins = [...sharedPlugins]
      const declaration = isModule && !output
      plugins.push(
        typescript({ 
          tsconfig: { 
            ...sharedTsconfig, declarationMap: declaration, declaration 
          } 
        })
      )
      configurations.push({
        ...sharedConfiguration, plugins,
        output: { ...sharedOutput, format, file: `${dir}.${outputExtension}` }      
      })
    }
    if (format === 'umd' && !(BUILD_ONLY === 'esm')) {
        const umdPlugins = [...sharedPlugins]
        umdPlugins.push(typescript({ tsconfig: sharedTsconfig }))
        umdPlugins.push(terser())
        configurations.push({
        ...sharedConfiguration,
        output: { 
          ...sharedOutput, format, file: `${dir}.min.${outputExtension}` 
        },
        plugins: umdPlugins, 
      })
    }
  })  
  return configurations
}