import fs from 'fs'
import path from 'path'

export const languages = () => {
  const extension = '.json'
  const dirPath = path.resolve('src', 'locale')
  const files = fs.readdirSync(dirPath)
  const jsonFiles = files.filter(file => file.endsWith(extension))
  const languages = jsonFiles.map(file => path.basename(file, extension))
  return languages
}

