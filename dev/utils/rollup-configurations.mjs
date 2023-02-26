import typescript from "rollup-plugin-ts"
import terser from '@rollup/plugin-terser'
import json from "@rollup/plugin-json"
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import path from 'path'

export const rollupConfigurations = (name, libName, extensionsByFormat, input, output) => {
  extensionsByFormat ||= { esm: 'mjs', umd: 'js' }
  const src = input || 'index.ts'
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
    },

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
  const tsconfig = {
    target: 'ESNext',
    resolveJsonModule: true, 
    allowSyntheticDefaultImports: true,
    declaration: false, declarationMap: false,
    lib: ["DOM", "ESNext", "ES2022"],
    // "isolatedModules": true,
    module: "ESNext",
    jsx: "react-jsx",
  }
  const sharedOutput = { 
    interop: 'auto', 
    name, 
    globals: {
      'react': 'React',
      // 'react-dom': 'ReactDOM',
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

  Object.entries(extensionsByFormat).forEach(([format, extension]) => {
    let dir = output || format
    if (!dir.includes('/')) {
      dir += '/'
      if (input) dir += path.basename(input, path.extname(input))
      else dir += libName
    }
    const declaration = format === 'esm' && !output
    const parserOpts = { ...tsconfig, declarationMap: declaration, declaration }
    const plugins = [...sharedPlugins, typescript({ tsconfig: parserOpts })]
    configurations.push({
      ...sharedConfiguration, plugins,
      output: { ...sharedOutput, format, file: `${dir}.${extension}` }      
    })
    if (format === 'umd') configurations.push({
      ...sharedConfiguration,
      output: { ...sharedOutput, format, file: `${dir}.min.${extension}`,  },
      plugins: [ ...sharedPlugins, typescript({ tsconfig }), terser()]
    })
  })  
  return configurations
}