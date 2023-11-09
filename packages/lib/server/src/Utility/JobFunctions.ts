import { DOT, JsonExtension } from '@moviemasher/lib-shared'
import { fileCreatedPromise, filePathExists, fileReadPromise, fileWriteJsonPromise } from './File.js'
import { ENV, ENVIRONMENT } from '../Environment/EnvironmentConstants.js'
import path from 'path'
import { DataOrError, ERROR, JobProduct, namedError, isDefiniteError } from '@moviemasher/runtime-shared'
import { JobStatus } from '../Types/Job.js'
import { JOB_ERRORED, JOB_FINISHED, JOB_STARTED } from './JobConstants.js'
import { isJobProduct } from './JobGuards.js'

export const jobPath = (id: string, status: JobStatus) => {
  const directory = ENVIRONMENT.get(ENV.ApiDirTemporary)
  const fileName = [status, JsonExtension].join(DOT)
  return path.join(directory, id, fileName)
}

export const jobHasStarted = (id: string, json?: any) => {
  return fileWriteJsonPromise(jobPath(id, JOB_STARTED), json || { id })
}

export const jobHasFinished = (id: string, json?: JobProduct) => {
  return fileWriteJsonPromise(jobPath(id, JOB_FINISHED), json || { id })
}

export const jobHasErrored = (id: string, json?: any) => {
  return fileWriteJsonPromise(jobPath(id, JOB_ERRORED), json || { id })
}

export const jobGetStatus = async (id: string): Promise<DataOrError<JobProduct | Date>> => {
  const finishedPath = jobPath(id, JOB_FINISHED) 
  const erroredPath = jobPath(id, JOB_ERRORED) 
  if (filePathExists(erroredPath)) {
    // an error was encountered while processing
    const errorStringOrError = await fileReadPromise(erroredPath)
    // see if there was an error reading the file
    if (isDefiniteError(errorStringOrError)) return errorStringOrError

    const { data: errorString } = errorStringOrError
    // assume file hasn't finished writing if empty
    if (errorString) return { error: JSON.parse(errorString) }
  } else if (filePathExists(finishedPath)) {
    // we at least completed processing
    const resultStringOrError = await fileReadPromise(finishedPath)
    
    // see if there was an error reading the file
    if (isDefiniteError(resultStringOrError)) return resultStringOrError
    
    const { data: resultString } = resultStringOrError
    // assume file hasn't finished writing if empty
    if (resultString) {
      const data = JSON.parse(resultString)
      if (!isJobProduct(data)) return namedError(ERROR.Syntax, resultString)
      
      return { data }
    }
  }
  return await fileCreatedPromise(jobPath(id, JOB_STARTED))
}