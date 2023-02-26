import fs from 'fs'

import { EncodeOutput, MashAndMediaObject, PathDataOrError } from "@moviemasher/moviemasher.js"
import { RenderingProcessArgs } from "./RenderingProcess/RenderingProcess"
import { renderingProcessInstance } from "./RenderingProcess/RenderingProcessFactory"
import { Environment, environment } from "../Environment/Environment"
import { EncodeResponse } from './Encode'


export const encode = (localPath: string, output: EncodeOutput): Promise<PathDataOrError> => {
  const { commandOutput } = output
  const temporaryDirectory = environment(Environment.API_DIR_TEMPORARY)
  const cacheDirectory = environment(Environment.API_DIR_CACHE)
  const filePrefix = environment(Environment.API_DIR_FILE_PREFIX)
  const validDirectories = environment(Environment.API_DIR_VALID).split(',')
  const outputDirectory = ''
  const defaultDirectory = ''

  return fs.promises.readFile(localPath).then(buffer => {
    const json = buffer.toString()
    const mash: MashAndMediaObject = JSON.parse(json)
    const options: RenderingProcessArgs = {
      temporaryDirectory, cacheDirectory, filePrefix, validDirectories, 
      outputDirectory, defaultDirectory,
      mash, 
      output: commandOutput, 
    }
    const { id } = mash
    const process = renderingProcessInstance(options) 
    return process.runPromise().then(runResult => {
      const {} = runResult.results
      return { path: id }
    })
  })
  
}