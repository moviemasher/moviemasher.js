import type { ProtocolDataOrError, ProtocolPlugin } from '../../Plugin/Protocol/Protocol.js'
import type { LoadType } from "@moviemasher/runtime-shared"
import type { JsonRecord, JsonRecords } from '@moviemasher/runtime-shared'
import type { 
  ClientAudio, ClientFont, 
  ClientImage, 
  ClientVideo} from '@moviemasher/runtime-client'
import type { DataOrError } from "@moviemasher/runtime-shared"
import type { FontType, RecordsType, RecordType } from "@moviemasher/runtime-shared"
import type { AudioType, ImageType, VideoType } from '@moviemasher/runtime-shared'
import type { StringType } from "@moviemasher/runtime-shared"


import { EndpointRequest } from '@moviemasher/runtime-shared'
import { assertEndpoint, endpointIsAbsolute, urlEndpoint, urlProtocol } from '../../Helpers/Endpoint/EndpointFunctions.js'
import { assertPopulatedString } from '../../Shared/SharedGuards.js'
import { isDefiniteError } from '@moviemasher/runtime-shared'
import { isPopulatedString } from "@moviemasher/runtime-shared"
import { errorThrow } from '@moviemasher/runtime-shared'
import { pluginDataOrErrorPromise } from '../../Plugin/PluginFunctions.js'
import { TypeProtocol } from '../../Plugin/PluginConstants.js'

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

// const setRequestResponse = (request: EndpointRequest, orError: DefiniteError | Data) => {
//   if (!isDefiniteError(orError)) request.response = orError.data
// }

// export const requestRecordPromise = (request: EndpointRequest, useResponse = false): Promise<JsonRecordDataOrError> => {
//   if (useResponse) {
//     const { response } = request
//     if (isJsonRecord(response)) return Promise.resolve({ data: response })
//   }
//   makeRequestEndpointAbsolute(request)
//   return requestProtocolPromise(request).then(protocolPlugin => {
//     // console.log('requestRecordPromise...', request, protocolPlugin)
//     return protocolPlugin.promise(request, TypeRecord).then(onError => {
//       // console.log('requestRecordPromise!', onError)
//       setRequestResponse(request, onError)
//       return onError
//     })
//   })
// }

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



