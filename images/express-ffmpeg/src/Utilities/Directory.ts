import fs from 'fs'

export const directoryLatest = (directory: string, extension: string) => {
  if (!fs.existsSync(directory)) return

  const files = fs.readdirSync(directory)
  const filesWithExt = files.filter(file => file.endsWith(extension)).sort()
  const count = filesWithExt.length
  const file = count && filesWithExt[count - 1]
  if (!file) return

  return `${directory}/${file}`
}

export const Directory = {
 latest: directoryLatest
}
