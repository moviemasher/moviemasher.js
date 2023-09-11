import type { EndpointRequest, EndpointRequests, Identified, JsonRecord, PotentialError, StringDataOrError } from '@moviemasher/runtime-shared'
import type { IdentifiedRequest } from '../Media/Media.js'
import type { Input } from '../Types/Input.js'
import type { JobType } from '../Types/JobTypes.js'

import { assertObject, assertRequest } from '@moviemasher/lib-shared'
import { EventServerAssetPromise, MovieMasher } from '@moviemasher/runtime-server'
import { ERROR, error, errorPromise, isArray, isDefiniteError } from '@moviemasher/runtime-shared'
import { ENV, ENVIRONMENT } from '../Environment/EnvironmentConstants.js'
import { assertIdentifiedRequest } from '../Media/MediaFunctions.js'
import { JobTypeDecoding, JobTypeEncoding, JobTypeTranscoding, assertJobType } from '../Setup/JobGuards.js'
import { assertDecodeRequest, decode } from '../decode/DecodeFunctions.js'
import { assertEncodeRequest, encode } from '../encode/EncodeFunctions.js'
import { assertTranscodeRequest, transcode } from '../transcode/TranscodeGuards.js'
import { assertFilePathExists } from './File.js'

export type JobTuple = [JobType, IdentifiedRequest]

export interface CallbackRequestBody extends Identified, PotentialError {
  completed: number
}

export const jobExtract = (object: JsonRecord): JobTuple => {
  const typeKeypath = ENVIRONMENT.get(ENV.ApiKeypathType)
        
  const jobKeypath = ENVIRONMENT.get(ENV.ApiKeypathJob)
        
  const { [typeKeypath]: jobType, [jobKeypath]: jobOrJobs } = object
  const job = isArray(jobOrJobs) ? jobOrJobs[0] : jobOrJobs
  
  assertObject(job, jobKeypath)
  assertJobType(jobType, typeKeypath)
  assertIdentifiedRequest(job)


  return [jobType, job]
}

const outputPromise = (localPath: string, request: EndpointRequest): Promise<PotentialError> => {
  throw new Error('outputPromise not implemented')
}

const inputPromise = (input: Input): Promise<StringDataOrError> => {
  const { request, loadType } = input
  assertRequest(request)

  const event = new EventServerAssetPromise(request, loadType)
  MovieMasher.eventDispatcher.dispatch(event)
  const { promise } = event.detail
  if (!promise) return errorPromise(ERROR.Unimplemented, EventServerAssetPromise.Type)


  return promise
}

export const callbackPromise = (request: EndpointRequest | EndpointRequests, body: CallbackRequestBody): Promise<PotentialError> => {
  throw new Error('callbackPromise not implemented')
  // const requests = isArray(request) ? request : [request]
  // const promises = requests.map(request => {
  //   request.init ||= {}
  //   request.init.body = body
  //   return requestPromise(request)
  // })
  // return Promise.all(promises).then(() => ({}))
}

const mediaRequestPromise = (jobType: JobType, mediaRequest: IdentifiedRequest): Promise<StringDataOrError> => {
  const { input } = mediaRequest
  return inputPromise(input).then(inputResult => {
    if (isDefiniteError(inputResult)) return inputResult

    const { data: localPath } = inputResult
    switch(jobType) {
      case JobTypeEncoding: {
        assertEncodeRequest(mediaRequest)
        const { output } = mediaRequest
        return encode(localPath, output)
      }
      case JobTypeDecoding: {
        assertDecodeRequest(mediaRequest)
        const { output } = mediaRequest
        return decode(localPath, output)
      }
      case JobTypeTranscoding: {
        assertTranscodeRequest(mediaRequest)
        const { output } = mediaRequest
        return transcode(localPath, output)
      }
      default: {
        return error(ERROR.Type, `Unknown job type ${jobType}`)
      }
    } 
  })
}

export const jobPromise = async (jobType: JobType, mediaRequest: IdentifiedRequest) => {
  const { id, callback, output } = mediaRequest
  const endResponse: Identified = { id }
  if (callback) {
    const startBody = await callbackPromise(callback, { id, completed: 0.1 })
    if (isDefiniteError(startBody)) return startBody
  }
  const mediaResponse = await mediaRequestPromise(jobType, mediaRequest)
  if (isDefiniteError(mediaResponse)) return mediaResponse

  const { request: outputRequest} = output
  if (outputRequest) {
    const { data: outputPath } = mediaResponse
    assertFilePathExists(outputPath)
    
    const uploadResult = await outputPromise(outputPath, outputRequest)
    if (isDefiniteError(uploadResult)) return uploadResult
  }
  if (callback) return await callbackPromise(callback, { id, completed: 1.0 })
  return endResponse
}
