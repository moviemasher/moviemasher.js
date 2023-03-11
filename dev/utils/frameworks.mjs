import fs from 'fs'
import path from 'path'

import { parseArgs } from "node:util"
import { fileURLToPath } from 'url';

const clientPackageDir = path.resolve(fileURLToPath(import.meta.url), '../../../workspaces/client')

import mitosisConfig from '../../workspaces/client/dev/mitosis.config.js'

export const frameworks = (args = {}) => {
  const { src = 'dest' } = args 

  const { [src]: source } = mitosisConfig
  switch (src) {
    case 'targets': return source
    case 'options': return Object.keys(source)
  }
  const dirPath = path.resolve(clientPackageDir, source)
  return fs.readdirSync(dirPath).filter(fileName => (
    fs.lstatSync(path.join(dirPath, fileName)).isDirectory()
  ))
}

const { values } = parseArgs({
  options: {
    src: {
      type: 'string',
      short: 's',
      default: 'dest',
    },
    dest: {
      type: 'string',
      short: 'd',
      default: '',
    }
  }
})
if (values.dest === 'stdout') {
  console.log(frameworks(values))
}
