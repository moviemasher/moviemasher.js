import type { AbsolutePath, DataOrError, FileReadArgs, JobProduct } from '@moviemasher/shared-lib/types.js'

import { $JSON, $READ, DOT, ERROR, isDefiniteError, isIdentified, isTyped, jsonParse, namedError } from '@moviemasher/shared-lib/runtime.js'
import path from 'path'
import { ENV, $ApiDirTemporary } from './env.js'
import { fileCreatedPromise, filePathExists, readFileFunction, writeJsonFilePromise } from '../module/file.js'
import { assertAbsolutePath } from '@moviemasher/shared-lib/utility/guards.js'

const STARTED = 'started'
const FINISHED = 'finished'
const ERRORED = 'errored'

const jobPath = (id: string, status: string): AbsolutePath => {
  const directory = ENV.get($ApiDirTemporary)
  const fileName = [status, $JSON].join(DOT)
  const absolutePath = path.join(directory, 'jobs', id, fileName)
  assertAbsolutePath(absolutePath)
  return absolutePath
}

export const jobHasStarted = (id: string, json?: any) => {
  return writeJsonFilePromise(jobPath(id, STARTED), json || { id })
}

export const jobHasFinished = (id: string, json?: JobProduct) => {
  return writeJsonFilePromise(jobPath(id, FINISHED), json || { id })
}

export const jobHasErrored = (id: string, json?: any) => {
  return writeJsonFilePromise(jobPath(id, ERRORED), json || { id })
}

export const jobGetStatus = async (id: string): Promise<DataOrError<JobProduct | Date>> => {
  const finishedPath = jobPath(id, FINISHED) 
  const erroredPath = jobPath(id, ERRORED) 
  if (filePathExists(erroredPath)) {
    // an error was encountered while processing
    const fileArgs: FileReadArgs = { path: erroredPath, type: $READ }
    const errorStringOrError = await readFileFunction(fileArgs)
    // see if there was an error reading the file
    if (isDefiniteError(errorStringOrError)) return errorStringOrError

    const { data: errorString } = errorStringOrError
    // assume file hasn't finished writing if empty
    if (errorString) return { error: jsonParse(errorString) }
  } else if (filePathExists(finishedPath)) {
    // we at least completed processing
    const fileArgs: FileReadArgs = { path: finishedPath, type: $READ }
    const resultStringOrError = await readFileFunction(fileArgs)
    
    // see if there was an error reading the file
    if (isDefiniteError(resultStringOrError)) return resultStringOrError
    
    const { data: resultString } = resultStringOrError
    // assume file hasn't finished writing if empty
    if (resultString) {
      const data = jsonParse(resultString)
      if (!isTyped(data)) return namedError(ERROR.Syntax, resultString)
      
      return { data }
    }
  }
  return await fileCreatedPromise(jobPath(id, STARTED))
}



// const isJobProduct = (value: any): value is JobProduct => {
//   return isTyped(value) && isIdentified(value)
// }

export const $DECODING = 'decoding'
export const $ENCODING = 'encoding'
export const $TRANSCODING = 'transcoding'

