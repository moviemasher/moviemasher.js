import type { ProtocolDataOrError, ProtocolPlugin } from '../../Plugin/Protocol/Protocol.js'
import type { DefiniteError } from '@moviemasher/runtime-shared'
import type { JsonRecordDataOrError, JsonRecordsDataOrError } from '../ClientMedia/ClientMedia.js'
import type { Data } from "@moviemasher/runtime-shared"
import type { LoadType } from '../../Setup/LoadType.js'
import type { JsonRecord, JsonRecords } from '@moviemasher/runtime-shared'
import type { 
  ClientAudio, ClientAudioDataOrError, ClientFont, ClientFontDataOrError, 
  ClientImage, ClientImageDataOrError, ClientMedia, ClientMediaType, 
  ClientVideo, ClientVideoDataOrError} from '../ClientMedia/ClientMedia.js'
import type { DataOrError } from "@moviemasher/runtime-shared"
import type { FontType, RecordsType, RecordType } from '../../Setup/Enums.js'
import type { AudioType, ImageType, VideoType } from '@moviemasher/runtime-shared'
import type { StringType } from "../../Utility/ScalarTypes.js"

import { TypeFont, TypeRecords, TypeRecord } from "../../Setup/EnumConstantsAndFunctions.js"
import { TypeAudio, TypeImage, TypeVideo } from "@moviemasher/runtime-shared"
import { ContentTypeHeader, DotChar, JsonMimetype } from '../../Setup/Constants.js'

import { EndpointRequest } from './Request.js'
import { assertMethod, GetMethod, Method, PostMethod } from "./Method.js"
import { assertEndpoint, endpointIsAbsolute, isEndpoint, urlEndpoint } from '../Endpoint/EndpointFunctions.js'
import { assertPopulatedString, isDefiniteError, isJsonRecord, isJsonRecords, isObject, isUndefined } from '../../Shared/SharedGuards.js'
import { errorThrow } from '../Error/ErrorFunctions.js'
import { isClientAudio, isClientFont, isClientImage, isClientVideo } from '../ClientMedia/ClientMediaFunctions.js'
import { pluginDataOrErrorPromise } from '../../Plugin/PluginFunctions.js'
import { TypeProtocol } from '../../Plugin/PluginConstants.js'

const makeRequestEndpointAbsolute = (request: EndpointRequest): void => {
  const { endpoint } = request
  assertEndpoint(endpoint)
  if (!endpointIsAbsolute(endpoint)) request.endpoint = urlEndpoint(endpoint)
}

export const requestExtension = (request: EndpointRequest): string => {
  const { endpoint } = request
  assertEndpoint(endpoint)
  
  const { pathname = '' } = endpoint
  const last = pathname.split(DotChar).pop() || ''
  return last.trim()
}

export const requestProtocol = (request: EndpointRequest): string => {
  const { endpoint } = request
  assertEndpoint(endpoint)
  const { protocol } = endpoint
  assertPopulatedString(protocol)
  return protocol
}

export const requestAudioPromise = (request: EndpointRequest): Promise<ClientAudioDataOrError> => {
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

export const requestFontPromise = (request: EndpointRequest): Promise<ClientFontDataOrError> => {
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

export const requestImagePromise = (request: EndpointRequest): Promise<ClientImageDataOrError> => {
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

export const protocolLoadPromise = (protocol: string): Promise<ProtocolPlugin> => {
  return pluginDataOrErrorPromise(protocol, TypeProtocol).then(orError => {
    if (isDefiniteError(orError)) return errorThrow(orError)
  
    return orError.data
  })
}


const requestProtocolPromise = (request: EndpointRequest): Promise<ProtocolPlugin> => {
  return protocolLoadPromise(requestProtocol(request))
}

const setRequestResponse = (request: EndpointRequest, orError: DefiniteError | Data) => {
  if (!isDefiniteError(orError)) request.response = orError.data
}

export const requestVideoPromise = (request: EndpointRequest): Promise<ClientVideoDataOrError> => {
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

export const requestRecordPromise = (request: EndpointRequest, useResponse = false): Promise<JsonRecordDataOrError> => {
  if (useResponse) {
    const { response } = request
    if (isJsonRecord(response)) return Promise.resolve({ data: response })
  }
  makeRequestEndpointAbsolute(request)
  return requestProtocolPromise(request).then(protocolPlugin => {
    // console.log('requestRecordPromise...', request, protocolPlugin)
    return protocolPlugin.promise(request, TypeRecord).then(onError => {
      // console.log('requestRecordPromise!', onError)
      setRequestResponse(request, onError)
      return onError
    })
  })
}

export const requestRecordsPromise = (request: EndpointRequest, useResponse = false): Promise<JsonRecordsDataOrError> => {
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

export function requestPromise(request: EndpointRequest, type: ImageType): Promise<DataOrError<ClientImage>>
export function requestPromise(request: EndpointRequest, type: AudioType): Promise<DataOrError<ClientAudio>>
export function requestPromise(request: EndpointRequest, type: FontType): Promise<DataOrError<ClientFont>>
export function requestPromise(request: EndpointRequest, type: VideoType): Promise<DataOrError<ClientVideo>>
export function requestPromise(request: EndpointRequest, type: RecordType): Promise<DataOrError<JsonRecord>>
export function requestPromise(request: EndpointRequest, type: RecordsType): Promise<DataOrError<JsonRecords>>
export function requestPromise(request: EndpointRequest, type: StringType): Promise<DataOrError<string>>
export function requestPromise(request: EndpointRequest, type: LoadType): Promise<ProtocolDataOrError>
{
  makeRequestEndpointAbsolute(request)
  return requestProtocolPromise(request).then(protocolPlugin => 
    protocolPlugin.promise(request, type)
  )
}

const requestMethod = (request: EndpointRequest): Method => {
  const { init = {} } = request
  const { method = PostMethod } = init
  assertMethod(method)

  return method
}

const requestContentType = (request: EndpointRequest): string => {
  const { init = {} } = request
  const { headers = {} } = init
  const { [ContentTypeHeader]: contentType = JsonMimetype } = headers
  return contentType
}

const requestFormData = (values: any = {}): FormData => {
  const formData = new FormData()
  Object.entries(values).forEach(([key, value]) => {
    if (isUndefined(value)) return

    const isBlobOrFile = value instanceof Blob || value instanceof File
    const blobFileOrString = isBlobOrFile ? value : String(value)
    formData.set(key, blobFileOrString)
  })
  return formData
}

const requestSearch = (values: any = {}): string => {
  return `?${new URLSearchParams(values)}`
}

export const requestPopulate = (request: EndpointRequest, params: any = {}): void => {
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


export function requestClientMediaPromise(request: EndpointRequest, type: AudioType): Promise<DataOrError<ClientAudio>>
export function requestClientMediaPromise(request: EndpointRequest, type: FontType): Promise<DataOrError<ClientFont>>
export function requestClientMediaPromise(request: EndpointRequest, type: ImageType): Promise<DataOrError<ClientImage>>
export function requestClientMediaPromise(request: EndpointRequest, type: VideoType): Promise<DataOrError<ClientVideo>>
export function requestClientMediaPromise(request: EndpointRequest, type: ClientMediaType): Promise<DataOrError<ClientMedia>> 
export function requestClientMediaPromise(request: EndpointRequest, type: ClientMediaType): Promise<DataOrError<ClientMedia>> {
  switch(type) {
    case TypeAudio: return requestAudioPromise(request)
    case TypeFont: return requestFontPromise(request)
    case TypeImage: return requestImagePromise(request)
    case TypeVideo: return requestVideoPromise(request)
  }
}

export const isRequest = (value: any): value is EndpointRequest => {
  return isObject(value) && (
    ('endpoint' in value && isEndpoint(value.endpoint) || 
    ('response' in value && isObject(value.response))
  ))
}
export function assertRequest(value: any, name?: string): asserts value is EndpointRequest {
  if (!isRequest(value)) errorThrow(value, 'Request', name)
}
