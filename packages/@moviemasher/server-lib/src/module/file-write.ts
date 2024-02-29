import type { DataOrError, FileFunction, OutputOptions, StringDataOrError } from '@moviemasher/shared-lib/types.js'

import { DOT, ERROR, errorCaught, errorThrow, isDefiniteError, jsonParse, jsonStringify, namedError } from '@moviemasher/shared-lib/runtime.js'
import { isString } from '@moviemasher/shared-lib/utility/guard.js'
import { assertPopulatedString } from '@moviemasher/shared-lib/utility/guards.js'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

type FilePath = string

export const fileLinkPromise = async (source: string, destination: string): Promise<StringDataOrError> => {
  if (!filePathExists(source)) return namedError(ERROR.Internal, `fileLinkPromise source ${source}`)
  
  if (!filePathExists(destination)) {
    const orError = await directoryCreatePromise(path.dirname(destination))
    if (isDefiniteError(orError)) return orError

    try {
      await fs.promises.symlink(source, destination)
      console.log('fileLinkPromise linked', { source, destination })

    } catch (error) { 
      console.error('fileLinkPromise error', { source, destination, error })
      // return errorCaught(error)
     }
  } else {
    console.log('fileLinkPromise destination exists', { source, destination })
  }

  return { data: destination }
}

export const filePathExists = (value: any): value is FilePath => {
  return isString(value) && fs.existsSync(value)
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

export const fileCopy = (source: string, destination: string, dontReplace?: boolean): StringDataOrError => {
  if (!filePathExists(source)) return namedError(ERROR.Internal, `fileCopyPromise source ${source}`)
  const result = { data: destination }

  if (filePathExists(destination) && dontReplace) return result

  const dir = path.dirname(destination)
  directoryCreate(dir)
  
  fs.copyFileSync(source, destination)
  return result
}

export const fileCopyPromise = async (source: string, destination: string, dontReplace?: boolean): Promise<StringDataOrError> => {
  if (!filePathExists(source)) return namedError(ERROR.Internal, `fileCopyPromise source ${source}`)
  const result = { data: destination }
  if (filePathExists(destination) && dontReplace) return result

  const orError = await directoryCreatePromise(path.dirname(destination))
  if (isDefiniteError(orError)) return orError
  
  try {
    await fs.promises.copyFile(source, destination)
  } catch (error) { return errorCaught(error) }
  return result
}

export const fileWritePromise = async (filePath: string, content: string, dontReplace?: boolean): Promise<StringDataOrError> => {
  if (!(dontReplace && filePathExists(filePath))) {
    const dir = path.dirname(filePath)
    if (!filePathExists(dir)) {
      const orError = await directoryCreatePromise(dir)
      if (isDefiniteError(orError)) return orError
    }
    try {
      await fs.promises.writeFile(filePath, content)
      // console.log('fileWritePromise', { filePath, content })
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
  return await fileWritePromise(filePath, jsonStringify(data))
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
    const data = jsonParse<T>(orError.data)
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
  if (!filePathExists(filePath)) return namedError(ERROR.Internal, filePath)
  try {
    const stats = await fs.promises.stat(filePath)
    const { mtime: data } = stats
    return { data }
  } catch (error) { return errorCaught(error) }
}

export const fileNameFromContent = (content: string): string => (
  crypto.createHash('md5').update(content).digest("hex")
)

export const fileNameFromOptions = (outputOptions: OutputOptions, encodingType: string, extension?: string): string => {
  const { format, extension: outputExtension } = outputOptions

  const ext = extension || outputExtension || format
  assertPopulatedString(ext, 'extension')

  return [encodingType, ext].join(DOT)
}

export const fileWriteFunction: FileFunction = args => {
  const { content, path, dontReplace } = args
  return fileWritePromise(path, content, dontReplace)
}