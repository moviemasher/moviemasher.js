import ts from "rollup-plugin-ts"
import json from "@rollup/plugin-json"

import pkg from "../../package.json"

const { source, module } = pkg

export default {
  input: source,
  output: { format: 'esm', file: module },
  plugins: [
    ts({ tsconfig: './dev/tsconfig.json' }), 
    json({ preferConst: true, indent: '  ', namedExports: true })    
  ]
}
