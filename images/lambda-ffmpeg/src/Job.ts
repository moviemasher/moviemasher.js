import type { IdentifiedRequest } from '@moviemasher/lib-server/src/Media/Media.js'
import type { Input } from '@moviemasher/lib-server/src/Types/Input.js'
import type { JobType } from '@moviemasher/lib-server/src/Types/JobTypes.js'
import type { Output } from '@moviemasher/lib-shared'
import type { AssetType, Assets, Data, Decoding, DecodingType, DefiniteError, EndpointRequest, EndpointRequests, Identified, ImportType, JsonRecord, MashAssetObject, OutputOptions, PotentialError, StringDataOrError, TranscodingType } from '@moviemasher/runtime-shared'

import { isIdentifiedRequest } from '@moviemasher/lib-server'
import { ENV, ENVIRONMENT } from '@moviemasher/lib-server/src/Environment/EnvironmentConstants.js'
import { assertIdentifiedRequest } from '@moviemasher/lib-server/src/Media/MediaFunctions.js'
import { assertFilePathExists } from '@moviemasher/lib-server/src/Utility/File.js'
import { assertObject, assertRequest, isOutput, isTranscodingType } from '@moviemasher/lib-shared'
import { EventServerAssetPromise, MovieMasher } from '@moviemasher/runtime-server'
import { ERROR, error, errorPromise, errorThrow, isArray, isDecodingType, isDefiniteError, isTyped } from '@moviemasher/runtime-shared'
import { JobTypeDecoding, JobTypeEncoding, JobTypeTranscoding, assertJobType } from './JobGuards.js'


export interface EncodeOutput extends Output {
  type: AssetType
  options: OutputOptions
}

export interface EncodeInput extends Input {
  mash?: MashAssetObject
  assets?: Assets
}

export interface EncodeRequest extends IdentifiedRequest {
  input: EncodeInput
  output: EncodeOutput
}

export type EncodeResponse = DefiniteError | Identified


export type DecodeData = Data<Decoding>
export type DecodeDataOrError = DefiniteError | DecodeData

export interface DecodeOutput extends Output {
  type: DecodingType
  options?: unknown
}


export interface DecodeRequest extends IdentifiedRequest {
  input: DecodeInput
  output: DecodeOutput
}

export interface DecodeInput extends Required<Input> {
  type: AssetType
}


interface TranscodeOutput extends Output {
  options: OutputOptions
  type: TranscodingType
}

interface TranscoderOptions extends Output {}

interface FontTranscoderOptions extends TranscoderOptions {}


interface TranscodeInput extends Required<Input> {
  type: ImportType
}

interface TranscodeRequest extends IdentifiedRequest {
  input: TranscodeInput
  output: TranscodeOutput
}

type TranscodeResponse = DefiniteError | Identified


const isDecodeOutput = (value: any): value is DecodeOutput => {
  return isOutput(value) && 'type' in value && isDecodingType(value.type)
}

function assertDecodeOutput(value: any): asserts value is DecodeOutput {
  if (!isDecodeOutput(value)) errorThrow(value, 'DecodeOutput')
}
const isTranscodeOutput = (value: any): value is TranscodeOutput => {
  return isOutput(value) && isTyped(value) && isTranscodingType(value.type)
}




const isDecodeRequest = (value: any): value is DecodeRequest => {
  return isIdentifiedRequest(value)
}
function assertDecodeRequest(value: any): asserts value is DecodeRequest {
  if (!isDecodeRequest(value)) errorThrow(value, 'DecodeRequest')
}


const isTranscodeRequest = (value: any): value is TranscodeRequest => {
  return isIdentifiedRequest(value) && 'output' in value && isTranscodeOutput(value.output)
}

function assertTranscodeRequest(value: any): asserts value is TranscodeRequest {
  if (!isTranscodeRequest(value))
    errorThrow(value, 'TranscodeRequest')
}


const isEncodeRequest = (value: any): value is EncodeRequest => {
  return isIdentifiedRequest(value) 
} 
function assertEncodeRequest(value: any): asserts value is EncodeRequest {
  if (!isEncodeRequest(value)) errorThrow(value, 'EncodeRequest')
}


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
