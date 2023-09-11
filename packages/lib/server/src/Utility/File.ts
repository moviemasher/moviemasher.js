import type { Strings } from '@moviemasher/runtime-shared'

import { EmptyFunction } from '@moviemasher/lib-shared'
import { errorThrow, isPopulatedString } from '@moviemasher/runtime-shared'
import fs from 'fs'
import path from 'path'
import { ENV, ENVIRONMENT } from '../Environment/EnvironmentConstants.js'
import { idUnique } from './Hash.js'

export type FilePath = string

export const filePathExists = (value: any): value is FilePath => {
  return isPopulatedString(value) && fs.existsSync(value)
}

export function assertFilePathExists(value: any, name?: string): asserts value is FilePath {
  if (!filePathExists(value)) errorThrow(value, 'FilePath', name)
}

export const directoryCreate = (path: string): void => {
  if (!filePathExists(path)) fs.mkdirSync(path, { recursive: true })
}

export const directoryCreatePromise = (directoryPath: string): Promise<void> => {
  return fs.promises.mkdir(directoryPath, { recursive: true }).then(EmptyFunction)
}

export const fileWritePromise = (filePath: string, content: string): Promise<void> => {
  const dir = path.dirname(filePath)
  const dirPromise = filePathExists(dir) ? Promise.resolve() : directoryCreatePromise(dir)
  const writePromise = dirPromise.then(() => fs.promises.writeFile(filePath, content))
  return writePromise.then(EmptyFunction)
}

export const fileWrite = (filePath: string, content: string): void => {
  const dir = path.dirname(filePath)
  if (!filePathExists(dir)) directoryCreate(dir)

  fs.writeFileSync(filePath, content)
}

export const fileWriteJsonPromise = (filePath: string, data: any): Promise<void> => {
  return fileWritePromise(filePath, JSON.stringify(data, null, 2))
}

export const fileRead = (file?: string): string => {
  return file ? fs.readFileSync(file).toString() : ''
}

export const fileReadPromise = (file?: string): Promise<string> => {
  if (!file) return Promise.resolve('')

  return fs.promises.readFile(file).then(res => res.toString()) 
}

export const fileTemporaryPath = (fileName = '', extension?: string): string => {
  const directory = ENVIRONMENT.get(ENV.ApiDirCache)
  const components: Strings = [fileName || idUnique()]
  if (extension) components.push(extension)
  const name = components.join('.')
  return path.resolve(directory, name)
}

export const fileRemove = (filePath: string) => {
  if (filePathExists(filePath)) fs.unlinkSync(filePath)
}

export const fileRemovePromise = (filePath: string) => {
  if (!filePathExists(filePath)) return Promise.resolve()
  
  return fs.promises.unlink(filePath)
}