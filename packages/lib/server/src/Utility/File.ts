import type { DataOrError, StringDataOrError } from '@moviemasher/runtime-shared'

import { ERROR, namedError, errorCaught, errorThrow, isDefiniteError, isPopulatedString } from '@moviemasher/runtime-shared'
import fs from 'fs'
import path from 'path'
import { DOT } from '@moviemasher/lib-shared'

export type FilePath = string

export const filePathExists = (value: any): value is FilePath => {
  return isPopulatedString(value) && fs.existsSync(value)
}

export const filenameAppend = (filePath: string, append: string, delimiter = DOT): string => {
  const { dir, ext, name, } = path.parse(filePath)
  const fileName = [name, delimiter, append, ext].join('')
  return path.join(dir, fileName)
}

export const fileMovePromise = async (source: string, destination: string): Promise<StringDataOrError> => {
  if (!filePathExists(source)) return namedError(ERROR.Internal, `fileMovePromise source ${source}`)
  if (filePathExists(destination)) return namedError(ERROR.Internal, `fileMovePromise destination ${destination}`)

  try {
    await fs.promises.rename(source, destination)
  } catch (error) { return errorCaught(error) }

  return { data: destination }
}

export function assertFilePathExists(value: any, name?: string): asserts value is FilePath {
  if (!filePathExists(value)) errorThrow(value, 'FilePath', name)
}

export const directoryCreate = (path: string): void => {
  if (!filePathExists(path)) fs.mkdirSync(path, { recursive: true })
}

export const directoryCreatePromise = async (directoryPath: string): Promise<StringDataOrError> => {
  const exists = filePathExists(directoryPath)
  if (!exists) {
    try {
      await fs.promises.mkdir(directoryPath, { recursive: true })
    } catch (error) { return errorCaught(error) }
  }
  return { data: directoryPath }
}

export const fileWritePromise = async (filePath: string, content: string, dontReplace?: boolean): Promise<StringDataOrError> => {
  if (!(dontReplace && filePathExists(filePath))) {
    const dir = path.dirname(filePath)
    const orError = await directoryCreatePromise(dir)
    if (isDefiniteError(orError)) return orError
    try {
      await fs.promises.writeFile(filePath, content)
    } catch (error) { return errorCaught(error) }
  }
  return { data: filePath }
}

export const fileWrite = (filePath: string, content: string): void => {
  const dir = path.dirname(filePath)
  if (!filePathExists(dir)) directoryCreate(dir)

  fs.writeFileSync(filePath, content)
}

export const fileWriteJsonPromise = async (filePath: string, data: any): Promise<StringDataOrError> => {
  return await fileWritePromise(filePath, JSON.stringify(data, null, 2))
}

export const fileRead = (file?: string): string => {
  return file ? fs.readFileSync(file).toString() : ''
}

export const fileReadPromise = async (file?: string): Promise<StringDataOrError> => {
  if (!file) return namedError(ERROR.Url, 'file')
  try {
    const res = await fs.promises.readFile(file)
    return { data: res.toString() }
  } catch (error) { return errorCaught(error) }
}

export const fileReadJsonPromise = async <T = any>(file?: string): Promise<DataOrError<T>> => {
  const orError = await fileReadPromise(file)
  if (isDefiniteError(orError)) return orError
  try {
    const data: T = JSON.parse(orError.data)
    return { data }
  } catch (error) { return errorCaught(error) }
}

export const fileRemove = (filePath: string) => {
  if (filePathExists(filePath)) fs.unlinkSync(filePath)
}

export const fileRemovePromise = async (filePath: string) => {
  if (!filePathExists(filePath)) return { data: filePath }
  try {
    await fs.promises.unlink(filePath)
  } catch (error) { return errorCaught(error) }
}

export const fileCreatedPromise = async (filePath: string): Promise<DataOrError<Date>> => {
  if (!filePathExists(filePath)) return namedError(ERROR.Internal, 'non-existent file')
  try {
    const stats = await fs.promises.stat(filePath)
    const { mtime: data } = stats
    return { data }
  } catch (error) { return errorCaught(error) }
}