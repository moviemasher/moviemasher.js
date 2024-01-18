import type { DataOrError, JobProduct } from '@moviemasher/shared-lib/types.js'

import { DOT, JSON, isIdentified, isTyped } from '@moviemasher/shared-lib/runtime.js'
import { ERROR, isDefiniteError, jsonParse, namedError } from '@moviemasher/shared-lib/runtime.js'
import path from 'path'
import { ENV_KEY, ENV } from './EnvironmentConstants.js'
import { fileCreatedPromise, filePathExists, fileReadPromise, fileWriteJsonPromise } from './File.js'

const STARTED = 'started'
const FINISHED = 'finished'
const ERRORED = 'errored'

const jobPath = (id: string, status: string) => {
  const directory = ENV.get(ENV_KEY.ApiDirTemporary)
  const fileName = [status, JSON].join(DOT)
  return path.join(directory, 'jobs', id, fileName)
}

export const jobHasStarted = (id: string, json?: any) => {
  return fileWriteJsonPromise(jobPath(id, STARTED), json || { id })
}

export const jobHasFinished = (id: string, json?: JobProduct) => {
  return fileWriteJsonPromise(jobPath(id, FINISHED), json || { id })
}

export const jobHasErrored = (id: string, json?: any) => {
  return fileWriteJsonPromise(jobPath(id, ERRORED), json || { id })
}

export const jobGetStatus = async (id: string): Promise<DataOrError<JobProduct | Date>> => {
  const finishedPath = jobPath(id, FINISHED) 
  const erroredPath = jobPath(id, ERRORED) 
  if (filePathExists(erroredPath)) {
    // an error was encountered while processing
    const errorStringOrError = await fileReadPromise(erroredPath)
    // see if there was an error reading the file
    if (isDefiniteError(errorStringOrError)) return errorStringOrError

    const { data: errorString } = errorStringOrError
    // assume file hasn't finished writing if empty
    if (errorString) return { error: jsonParse(errorString) }
  } else if (filePathExists(finishedPath)) {
    // we at least completed processing
    const resultStringOrError = await fileReadPromise(finishedPath)
    
    // see if there was an error reading the file
    if (isDefiniteError(resultStringOrError)) return resultStringOrError
    
    const { data: resultString } = resultStringOrError
    // assume file hasn't finished writing if empty
    if (resultString) {
      const data = jsonParse(resultString)
      if (!isJobProduct(data)) return namedError(ERROR.Syntax, resultString)
      
      return { data }
    }
  }
  return await fileCreatedPromise(jobPath(id, STARTED))
}



const isJobProduct = (value: any): value is JobProduct => {
  return isTyped(value) && isIdentified(value)
}
