import type { ProtocolDataOrError, ProtocolPlugin } from '../../Plugin/Protocol/Protocol.js'
import type { DefiniteError } from '@moviemasher/runtime-shared'
import type { JsonRecordDataOrError } from '../ClientMedia/ClientMedia.js'
import type { Data } from "@moviemasher/runtime-shared"
import type { LoadType } from '../../Setup/LoadType.js'
import type { JsonRecord, JsonRecords } from '@moviemasher/runtime-shared'
import type { 
  ClientAudio, ClientFont, 
  ClientImage, ClientMedia, ClientMediaType, 
  ClientVideo} from '../ClientMedia/ClientMedia.js'
import type { DataOrError } from "@moviemasher/runtime-shared"
import type { FontType, RecordsType, RecordType } from '../../Setup/Enums.js'
import type { AudioType, ImageType, VideoType } from '@moviemasher/runtime-shared'
import type { StringType } from "@moviemasher/runtime-shared"

import { TypeFont, TypeRecord } from "../../Setup/EnumConstantsAndFunctions.js"
import { TypeAudio, TypeImage, TypeVideo } from "@moviemasher/runtime-shared"
import { ContentTypeHeader, JsonMimetype } from '../../Setup/Constants.js'

import { EndpointRequest } from '@moviemasher/runtime-shared'
import { assertMethod, GetMethod, Method, PostMethod } from "./Method.js"
import { assertEndpoint, endpointIsAbsolute, urlEndpoint, urlProtocol } from '../Endpoint/EndpointFunctions.js'
import { assertPopulatedString, isDefiniteError, isJsonRecord, isPopulatedString, isUndefined } from '../../Shared/SharedGuards.js'
import { errorThrow } from '../Error/ErrorFunctions.js'
import { pluginDataOrErrorPromise } from '../../Plugin/PluginFunctions.js'
import { TypeProtocol } from '../../Plugin/PluginConstants.js'
import { requestFontPromise } from "../../Client/Listener/client-font.js"
import { requestVideoPromise } from "../../Client/Listener/client-video.js"
import { requestImagePromise } from "../../Client/Listener/client-image.js"
import { requestAudioPromise } from '../../Client/Listener/client-audio.js'



const makeRequestEndpointAbsolute = (request: EndpointRequest): void => {
  const { endpoint } = request
  if (isPopulatedString(endpoint)) return

  assertEndpoint(endpoint)
  if (!endpointIsAbsolute(endpoint)) request.endpoint = urlEndpoint(endpoint)
}


const requestProtocol = (request: EndpointRequest): string => {
  const { endpoint } = request
  if (isPopulatedString(endpoint)) return urlProtocol(endpoint)

  assertEndpoint(endpoint)
  const { protocol } = endpoint
  assertPopulatedString(protocol)
  return protocol
}

const protocolLoadPromise = (protocol: string): Promise<ProtocolPlugin> => {
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

// export function requestClientMediaPromise(request: EndpointRequest, type: AudioType): Promise<DataOrError<ClientAudio>>
// export function requestClientMediaPromise(request: EndpointRequest, type: FontType): Promise<DataOrError<ClientFont>>
// export function requestClientMediaPromise(request: EndpointRequest, type: ImageType): Promise<DataOrError<ClientImage>>
// export function requestClientMediaPromise(request: EndpointRequest, type: VideoType): Promise<DataOrError<ClientVideo>>
// export function requestClientMediaPromise(request: EndpointRequest, type: ClientMediaType): Promise<DataOrError<ClientMedia>> 
// export function requestClientMediaPromise(request: EndpointRequest, type: ClientMediaType): Promise<DataOrError<ClientMedia>> {
//   console.debug('requestClientMediaPromise', request, type)
//   switch(type) {
//     case TypeAudio: return requestAudioPromise(request)
//     case TypeFont: return requestFontPromise(request)
//     case TypeImage: return requestImagePromise(request)
//     case TypeVideo: return requestVideoPromise(request)
//   }
// }
