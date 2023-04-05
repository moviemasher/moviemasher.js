import type { ProtocolDataOrError, ProtocolPlugin } from '../../Plugin/Protocol/Protocol.js'
import type { DefiniteError } from '../Error/Error.js'
import type { Data, JsonRecordDataOrError, JsonRecordsDataOrError } from '../ClientMedia/ClientMedia.js'
import type { LoadType } from '../../Setup/LoadType.js'
import type { JsonRecord, JsonRecords } from '../../Types/Core.js'
import type { 
  ClientAudio, ClientAudioDataOrError, ClientFont, ClientFontDataOrError, 
  ClientImage, ClientImageDataOrError, ClientMedia, ClientMediaType, 
  ClientVideo, ClientVideoDataOrError, DataOrError 
} from '../ClientMedia/ClientMedia.js'
import type { AudioType, FontType, ImageType, RecordsType, RecordType, VideoType } from '../../Setup/Enums.js'
import type { StringType } from '../../Utility/Scalar.js'

import { TypeAudio, TypeFont, TypeImage, TypeRecords, TypeRecord, TypeVideo } from '../../Setup/Enums.js'
import { ContentTypeHeader, JsonMimetype } from '../../Setup/Constants.js'

import { assertMethod, GetMethod, Method, PostMethod, Request } from './Request.js'
import { protocolLoadPromise } from '../../Plugin/Protocol/ProtocolFunctions.js'
import { assertEndpoint, endpointIsAbsolute, isEndpoint, urlEndpoint } from '../Endpoint/EndpointFunctions.js'
import { assertPopulatedString, isDefiniteError, isJsonRecord, isJsonRecords, isObject, isUndefined } from '../../Utility/Is.js'
import { errorPromise, errorThrow } from '../Error/ErrorFunctions.js'
import { isClientAudio, isClientFont, isClientImage, isClientVideo } from '../ClientMedia/ClientMediaFunctions.js'
import { ErrorName } from '../Error/ErrorName.js'

const makeRequestEndpointAbsolute = (request: Request): void => {
  const { endpoint } = request
  assertEndpoint(endpoint)
  if (!endpointIsAbsolute(endpoint)) request.endpoint = urlEndpoint(endpoint)
}

export const requestExtension = (request: Request): string => {
  const { endpoint } = request
  assertEndpoint(endpoint)
  
  const { pathname = '' } = endpoint
  const last = pathname.split('.').pop() || ''
  return last.trim()
}

export const requestProtocol = (request: Request): string => {
  const { endpoint } = request
  assertEndpoint(endpoint)
  const { protocol } = endpoint
  assertPopulatedString(protocol)
  return protocol
}

export const requestAudioPromise = (request: Request): Promise<ClientAudioDataOrError> => {
  const { response } = request
  if (isClientAudio(response)) return Promise.resolve({ data: response })

  makeRequestEndpointAbsolute(request)
  return requestProtocolPromise(request).then(protocolPlugin => 
    protocolPlugin.promise(request, TypeAudio).then(onError => {
      setRequestResponse(request, onError)
      return onError
    })
  )
}

export const requestFontPromise = (request: Request): Promise<ClientFontDataOrError> => {
  const { response } = request
  if (isClientFont(response)) return Promise.resolve({ data: response })

  makeRequestEndpointAbsolute(request)
  return requestProtocolPromise(request).then(protocolPlugin => 
    protocolPlugin.promise(request, TypeFont).then(onError => {
      setRequestResponse(request, onError)
      return onError
    })
  )
}

export const requestImagePromise = (request: Request): Promise<ClientImageDataOrError> => {
  const { response } = request
  if (isClientImage(response)) return Promise.resolve({ data: response })

  makeRequestEndpointAbsolute(request)
  return requestProtocolPromise(request).then(protocolPlugin => 
    protocolPlugin.promise(request, TypeImage).then(onError => {
      setRequestResponse(request, onError)
      return onError
    })
  )
}

export const requestProtocolPromise = (request: Request): Promise<ProtocolPlugin> => {
  return protocolLoadPromise(requestProtocol(request))
}

const setRequestResponse = (request: Request, orError: DefiniteError | Data) => {
  if (!isDefiniteError(orError)) request.response = orError.data
}

export const requestVideoPromise = (request: Request): Promise<ClientVideoDataOrError> => {
  const { response } = request
  if (isClientVideo(response)) return Promise.resolve({ data: response })

  makeRequestEndpointAbsolute(request)
  return requestProtocolPromise(request).then(protocolPlugin => 
    protocolPlugin.promise(request, TypeVideo).then(onError => {
      setRequestResponse(request, onError)
      return onError
    })
  )
}

export const requestRecordPromise = (request: Request, useResponse = false): Promise<JsonRecordDataOrError> => {
  if (useResponse) {
    const { response } = request
    if (isJsonRecord(response)) return Promise.resolve({ data: response })
  }
  makeRequestEndpointAbsolute(request)
  return requestProtocolPromise(request).then(protocolPlugin => 
    protocolPlugin.promise(request, TypeRecord).then(onError => {
      setRequestResponse(request, onError)
      return onError
    })
  )
}

export const requestRecordsPromise = (request: Request, useResponse = false): Promise<JsonRecordsDataOrError> => {
  if (useResponse) {
    const { response } = request
    if (isJsonRecords(response)) return Promise.resolve({ data: response })
  }
  makeRequestEndpointAbsolute(request)
  return requestProtocolPromise(request).then(protocolPlugin => 
    protocolPlugin.promise(request, TypeRecords).then(onError => {
      setRequestResponse(request, onError)
      return onError
    })
  )
}

export function requestPromise(request: Request, type: ImageType): Promise<DataOrError<ClientImage>>
export function requestPromise(request: Request, type: AudioType): Promise<DataOrError<ClientAudio>>
export function requestPromise(request: Request, type: FontType): Promise<DataOrError<ClientFont>>
export function requestPromise(request: Request, type: VideoType): Promise<DataOrError<ClientVideo>>
export function requestPromise(request: Request, type: RecordType): Promise<DataOrError<JsonRecord>>
export function requestPromise(request: Request, type: RecordsType): Promise<DataOrError<JsonRecords>>
export function requestPromise(request: Request, type: StringType): Promise<DataOrError<string>>
export function requestPromise(request: Request, type: LoadType): Promise<ProtocolDataOrError>
{
  makeRequestEndpointAbsolute(request)
  return requestProtocolPromise(request).then(protocolPlugin => 
    protocolPlugin.promise(request, type)
  )
}

export const requestMethod = (request: Request): Method => {
  const { init = {} } = request
  const { method = PostMethod } = init
  assertMethod(method)

  return method
}

export const requestContentType = (request: Request): string => {
  const { init = {} } = request
  const { headers = {} } = init
  const { [ContentTypeHeader]: contentType = JsonMimetype } = headers
  return contentType
}

export const requestFormData = (values: any = {}): FormData => {
  const formData = new FormData()
  Object.entries(values).forEach(([key, value]) => {
    if (isUndefined(value)) return

    const isBlobOrFile = value instanceof Blob || value instanceof File
    const blobFileOrString = isBlobOrFile ? value : String(value)
    formData.set(key, blobFileOrString)
  })
  return formData
}

export const requestSearch = (values: any = {}): string => {
  return `?${new URLSearchParams(values)}`
}

export const requestPopulate = (request: Request, params: any = {}): void => {
  if (requestMethod(request) === GetMethod) {
    request.endpoint ||= {}
    request.endpoint.search = requestSearch(params)
  } else {
    request.init ||= {}
    const contentType = requestContentType(request)
    if (contentType === JsonMimetype) {
      request.init.body = JSON.stringify(params)
    } else {  
      request.init.body = requestFormData(params)
    }
  }
}

export function requestClientMediaPromise(request: Request, type: AudioType): Promise<DataOrError<ClientAudio>>
export function requestClientMediaPromise(request: Request, type: FontType): Promise<DataOrError<ClientFont>>
export function requestClientMediaPromise(request: Request, type: ImageType): Promise<DataOrError<ClientImage>>
export function requestClientMediaPromise(request: Request, type: VideoType): Promise<DataOrError<ClientVideo>>
export function requestClientMediaPromise(request: Request, type: ClientMediaType): Promise<DataOrError<ClientMedia>> 
export function requestClientMediaPromise(request: Request, type: ClientMediaType): Promise<DataOrError<ClientMedia>> {
  switch(type) {
    case TypeAudio: return requestAudioPromise(request)
    case TypeFont: return requestFontPromise(request)
    case TypeImage: return requestImagePromise(request)
    case TypeVideo: return requestVideoPromise(request)
  }
  return errorPromise(ErrorName.Type)
}

export type RequestEncodingPromiseFunction = typeof requestClientMediaPromise

// const imageData = await requestClientMediaPromise({}, ImageType)
// if (!isDefiniteError(imageData)) imageData.data

// const audioData = await requestClientMediaPromise({}, AudioType)
// if (!isDefiniteError(audioData)) audioData.data

export const isRequest = (value: any): value is Request => {
  return isObject(value) && (
    ('endpoint' in value && isEndpoint(value.endpoint) || 
    ('response' in value && isObject(value.response))
  ))
}
export function assertRequest(value: any, name?: string): asserts value is Request {
  if (!isRequest(value)) errorThrow(value, 'Request', name)
}
