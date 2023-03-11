import fs from 'fs'
import path from 'path'

import { assertObject, assertString, assertPath, isObject, isJsonPath, isString, isPath } from './assert.mjs'

export const assignSafely = (object, key, value) => {
  assertObject(object, 'object')
  assertString(key, 'key')
  assertObject(value, 'value')

  object[key] ||= {}
  Object.assign(object[key], value)
}
export const assignDependencies = (object, values) => {
  const { dependencies, devDependencies, peerDependencies } = values
  if (dependencies) assignSafely(object, 'dependencies', dependencies)
  if (peerDependencies) assignSafely(object, 'peerDependencies', peerDependencies)
  if (devDependencies) assignSafely(object, 'devDependencies', devDependencies)
  return object
}


export const fileReadJson = (args) => {
  const text = fileReadText(args)
  const object = JSON.parse(text)
  assertObject(object, `json object from file ${args.src}`)
  return object
}

export const fileReadText = (args) => {
  const { src } = args
  assertPath(src, 'src')

  const resolved = path.resolve(src)
  const text = fs.readFileSync(path.resolve(resolved), 'utf8')

  assertString(text, `text from file ${resolved}`)
  return text
}

export const fileWriteText = (args) => {
  const { src, dest } = args
  assertString(src)
  if (!isPath(dest)) return src
  
  const resolved = path.resolve(dest)
  console.log(`writing ${resolved}`, src)
  // fs.mkdirSync(path.dirname(resolved), { recursive: true })
  // return fs.writeFileSync(resolved, src)
}

export const fileWriteJson = (args) => {
  const { src, dest } = args
  assertObject(src, 'src')
  const json = JSON.stringify(src, null, 2)
  return fileWriteText({ src: json, dest })
}

export const fileWrite = (args) => {
  const { src, dest } = args
  if (!dest || isObject(dest)) {
    if (!dest) return src
    return assignDependencies(dest, src)
  }
  if (isObject(src)) return fileWriteJson(args)
  
  return fileWriteText(args)
}

export const fileRead = (args) => {
  const { src, dest } = args
  if (!dest || isObject(dest)) {
    return isObject(src) ? src : fileReadJson(args)
  }
  if (isString(src)) {
    if (isJsonPath(src)) return fileReadJson(args)
    return fileReadText(args)
  }
  return src
}
