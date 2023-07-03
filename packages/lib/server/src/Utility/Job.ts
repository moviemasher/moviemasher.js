import type {  StringDataOrError,  
} from '@moviemasher/lib-shared'
import type { Input } from "../Types/Core.js"
import type { JobType, } from "../Setup/Enums.js"
import type { MediaRequest } from "../Media/Media.js"

import { 
  assertObject,requestPromise, 
  Runtime,  assertRequest
} from "@moviemasher/lib-shared"

import { assertJobType, JobTypeEncoding, JobTypeDecoding, JobTypeTranscoding  } from "../Setup/Enums.js"
import { EnvironmentKeyApiKeypathJob, EnvironmentKeyApiKeypathType } from "../Environment/ServerEnvironment.js"
import { 
  assertDecodeRequest, decode 
} from '../Plugin/Decode/DecodeFunctions.js'
import { 
  assertEncodeRequest, encode} from '../Plugin/Encode/EncodeFunctions.js'
import { 
  assertTranscodeRequest, transcode 
} from '../Plugin/Transcode/TranscodeFunctions.js'
import { assertFilePath } from './File.js'
import { assertMediaRequest } from '../Media/MediaFunctions.js'
import { EndpointRequest, isDefiniteError, TypeString, EndpointRequests, Identified, JsonRecord, PotentialError, ErrorName, error, isArray } from '@moviemasher/runtime-shared'

export type JobTuple = [JobType, MediaRequest]

export interface CallbackRequestBody extends Identified, PotentialError {
  completed: number
}

export const jobExtract = (object: JsonRecord): JobTuple => {

  const { environment } = Runtime
  const typeKeypath = environment.get(EnvironmentKeyApiKeypathType)
        
  const jobKeypath = environment.get(EnvironmentKeyApiKeypathJob)
        
  const { [typeKeypath]: jobType, [jobKeypath]: jobOrJobs } = object
  const job = isArray(jobOrJobs) ? jobOrJobs[0] : jobOrJobs
  
  assertObject(job, jobKeypath)
  assertJobType(jobType, typeKeypath)
  assertMediaRequest(job)


  return [jobType, job]
}

const outputPromise = (localPath: string, request: EndpointRequest): Promise<PotentialError> => {
  throw new Error('outputPromise not implemented')
  //requestPromise(request).then(() => { return {} })
}


const inputPromise = (input: Input): Promise<StringDataOrError> => {
  const { request } = input
  assertRequest(request)
  return requestPromise(request, TypeString)
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


const mediaRequestPromise = (jobType: JobType, mediaRequest: MediaRequest): Promise<StringDataOrError> => {
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
        return error(ErrorName.Type, `Unknown job type ${jobType}`)
      }
    } 
  })
}

export const jobPromise = async (jobType: JobType, mediaRequest: MediaRequest) => {
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
    assertFilePath(outputPath)
    
    const uploadResult = await outputPromise(outputPath, outputRequest)
    if (isDefiniteError(uploadResult)) return uploadResult
  }
  if (callback) return await callbackPromise(callback, { id, completed: 1.0 })
  return endResponse
}
