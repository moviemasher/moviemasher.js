import type { AssetType, Assets, Data, Decoding, DecodingType, DefiniteError, EndpointRequest, EndpointRequests, Identified, ImportType, JsonRecord, MashAssetObject, OutputOptions, PotentialError, StringDataOrError, TranscodingType } from '@moviemasher/runtime-shared'

import { ENV_KEY, ENV } from '@moviemasher/lib-server'
import { assertFilePathExists } from '@moviemasher/lib-server/src/Utility/File.js'
import { assertDefined, assertObject, isTranscodingType } from '@moviemasher/lib-shared'
import { EventServerAssetPromise, MOVIEMASHER_SERVER } from '@moviemasher/runtime-server'
import { ERROR, namedError, errorPromise, errorThrow, isArray, isDecodingType, isDefiniteError, isTyped, isIdentified, isObject } from '@moviemasher/runtime-shared'
import { DECODING, ENCODING, TRANSCODING } from '@moviemasher/lib-server'

type DecodingJobType = 'decoding'
type EncodingJobType = 'encoding'
type TranscodingJobType = 'transcoding'

type JobType = DecodingJobType | EncodingJobType | TranscodingJobType

interface Input {
  loadType: ImportType
  request?: EndpointRequest
}

interface Output {
  request?: EndpointRequest
  type: string
}

interface IdentifiedRequest extends Identified {
  callback?: EndpointRequest | EndpointRequests
  input: Input
  output: Output
}

const isIdentifiedRequest = (value: any): value is IdentifiedRequest => {
  return isIdentified(value) && 'input' in value && isObject(value.input)
}

function assertIdentifiedRequest(value: any): asserts value is IdentifiedRequest {
  if (!isIdentifiedRequest(value)) errorThrow(value, 'IdentifiedRequest')
}

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


const isOutput = (value: any): value is Output => {
  return isObject(value) && isTyped(value)
}

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
const TYPES = [DECODING, ENCODING, TRANSCODING]

const isJobType = (value: any): value is JobType => {
  return TYPES.includes(value as JobType)
}

function assertJobType(value: any, name?: string): asserts value is JobType {
  if (!isJobType(value)) errorThrow(value, 'JobType', name)
}

type JobTuple = [JobType, IdentifiedRequest]

interface CallbackRequestBody extends Identified, PotentialError {
  completed: number
}

export const jobExtract = (object: JsonRecord): JobTuple => {
  const typeKeypath = ENV.get(ENV_KEY.ApiKeypathType)
        
  const jobKeypath = ENV.get(ENV_KEY.ApiKeypathJob)
        
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
  assertDefined(request)

  const event = new EventServerAssetPromise(request, loadType)
  MOVIEMASHER_SERVER.eventDispatcher.dispatch(event)
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
      case ENCODING: {
        assertEncodeRequest(mediaRequest)
        const { output } = mediaRequest
        break //return encode(localPath, output)
      }
      case DECODING: {
        assertDecodeRequest(mediaRequest)
        const { output } = mediaRequest
        break //return decode(localPath, output)
      }
      case TRANSCODING: {
        assertTranscodeRequest(mediaRequest)
        const { output } = mediaRequest
        break //return transcode(localPath, output)
      }
    } 
    return namedError(ERROR.Type, `Unknown job type ${jobType}`)

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
