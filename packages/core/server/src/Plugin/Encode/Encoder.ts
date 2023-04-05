import fs from 'fs'

import { CommaChar, EncodeOutput, MashAndMediaObject, StringDataOrError, Runtime } from "@moviemasher/lib-core"
import { RenderingProcessArgs } from "./RenderingProcess/RenderingProcess"
import { renderingProcessInstance } from "./RenderingProcess/RenderingProcessFactory"
import { 
  EnvironmentKeyApiDirCache, EnvironmentKeyApiDirFilePrefix, 
  EnvironmentKeyApiDirTemporary, EnvironmentKeyApiDirValid 
} from '../../Environment/ServerEnvironment'


export const encode = (localPath: string, output: EncodeOutput): Promise<StringDataOrError> => {
  const { commandOutput } = output
  const { environment } = Runtime
  const temporaryDirectory = environment.get(EnvironmentKeyApiDirTemporary)
  const cacheDirectory = environment.get(EnvironmentKeyApiDirCache)
  const filePrefix = environment.get(EnvironmentKeyApiDirFilePrefix)
  const validDirectories = environment.get(EnvironmentKeyApiDirValid).split(CommaChar)
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
      return { data: id }
    })
  })
  
}