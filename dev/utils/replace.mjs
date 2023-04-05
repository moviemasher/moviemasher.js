
import { 
  assertArray, assertObject,  assertString, 
  isString, isObject, isArray
} from './assert.mjs'
import { fileRead, fileWrite } from './file.mjs'

export const replacePropertyObject = (field, object, create) => {
  assertObject(object, `object for field ${field}`)
  const components = field.split('.')
  if (components.length === 1) return [field, object]

  const [first, ...rest] = components
  const defined = object[first]
  if (!isObject(defined) && create) object[first] = {}

  return replacePropertyObject(rest.join('.'), object[first])
}


export const replaceText = (args) => {
  const { src, replacements } = args
  assertString(src, 'src')
  assertArray(replacements, 'replacements')
  // console.log('replaceText replacements', replacements)

  return replacements.reduce((text, { search, replace }) => {
    return text.replace(search, replace)
  }, src)
}

export const replaceJson = (args) => {
  const { src, replacements, dest = {} } = args
  assertObject(src, 'src')
  if (!isArray(replacements)) return src
  
  // console.log('replaceJson replacements', replacements)
  return replacements.reduce((reduced, { search, replace, key, keys }) => {
    assertObject(reduced, 'reduced')
    keys ||= [key]
    keys.forEach(key => {
      const [property, srcObject] = replacePropertyObject(key, src)
      const [_, destObject] = replacePropertyObject(key, reduced, true)
      assertString(property, `property for key ${key}`)
      assertObject(srcObject, `srcObject for property ${property}`)
      assertObject(destObject, `destObject for property ${property}`)
      destObject[property] = search ? srcObject[property].replace(search, replace) : replace
    })    
    return reduced
  }, isObject(dest) ? dest : src)
}

export const replace = (args) => {
  const { dest, replacements } = args
  const read = fileRead(args)
  
  const writeArgs = { src: read, dest }
  if (isArray(replacements)) {
    writeArgs.replacements = replacements
    writeArgs.src = isString(read) ? replaceText(writeArgs) : replaceJson(writeArgs)
  }
  return fileWrite(writeArgs)
}
