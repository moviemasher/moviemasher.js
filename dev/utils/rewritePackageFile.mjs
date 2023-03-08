
import fs from 'fs'
import path from 'path'

export const rewritePackageFile = (args) => {
  const { 
    srcDir = './', 
    destDir, 
    replacements = [],
  } = args
  const src = path.resolve(srcDir, 'package.json')
  const dest = path.resolve(destDir, 'package.json')

  const packageText = fs.readFileSync(src, 'utf8')
  const json = JSON.parse(packageText)

  const keyPropertyObject = (field, object) => {
    const components = field.split('.')
    if (components.length === 1) return [field, object]

    const [first, ...rest] = components

    return keyPropertyObject(rest.join('.'), object[first])
  }
  replacements.forEach(({ search, replace, key, keys }) => {
    keys ||= [key]
    keys.forEach(key => {
      const [property, object] = keyPropertyObject(key, json)
      object[property] = search ? object[property].replace(search, replace) : replace
    })    
  })
  fs.writeFileSync(dest, JSON.stringify(json, null, 2))
  console.log(dest.slice(dest.split('').findIndex((c, i) => src[i] !== c)))
}
