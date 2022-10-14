import ts from "rollup-plugin-ts"
import json from "@rollup/plugin-json"

import pkg from "../../package.json"

const { module } = pkg

export default {
  input: 'src/index.ts',
  output: { format: 'esm', file: module },
  plugins: [
    ts({ tsconfig: './dev/tsconfig.json' }), 
    json({ preferConst: true, indent: '  ', namedExports: true })    
  ]
}
