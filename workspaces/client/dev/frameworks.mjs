import fs from 'fs'
import path from 'path'
import mitosisConfig from './mitosis.config'

export const frameworks = () => {
  const { dest } = mitosisConfig
  const dirPath = path.resolve(dest)
  const frameworks = fs.readdirSync(dirPath)
  return frameworks
}

