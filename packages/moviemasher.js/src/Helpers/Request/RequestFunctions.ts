import { AudioDataOrError, FontDataOrError, ImageDataOrError, MediaDataOrError, VideoDataOrError } from "../../ClientMedia/ClientMedia"
import { Request } from "./Request"
import { protocolLoadPromise, ProtocolPlugin } from "../../Plugin/Protocol/Protocol"
import { assertEndpoint, endpointIsAbsolute } from "../Endpoint/EndpointFunctions"
import { assertPopulatedString, isArray, isDefiniteError, isJsonRecord, isJsonRecords, isObject } from "../../Utility/Is"
import { AudioType, FontType, ImageType, LoadType, RawType, RecordsType, RecordType, VideoType } from "../../Setup/Enums"
import { DefiniteError, PathDataOrError } from "../Error/Error"
import { urlEndpoint } from "../../Utility/Url"
import { Data, RecordDataOrError, RecordsDataOrError } from "../../ClientMedia/ClientMedia"
import { errorPromise } from "../Error/ErrorFunctions"
import { ErrorName } from "../Error/ErrorName"
import { isClientAudio, isClientFont, isClientImage, isClientVideo } from "../../ClientMedia/ClientMediaFunctions"

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

export const requestAudioPromise = (request: Request): Promise<AudioDataOrError> => {
  const { response } = request
  if (isClientAudio(response)) return Promise.resolve({ data: response })

  makeRequestEndpointAbsolute(request)
  return requestProtocolPromise(request).then(protocolPlugin => 
    protocolPlugin.promise(request, AudioType).then(onError => {
      setRequestResponse(request, onError)
      return onError
    })
  )
}

export const requestFontPromise = (request: Request): Promise<FontDataOrError> => {
  const { response } = request
  if (isClientFont(response)) return Promise.resolve({ data: response })

  makeRequestEndpointAbsolute(request)
  return requestProtocolPromise(request).then(protocolPlugin => 
    protocolPlugin.promise(request, FontType).then(onError => {
      setRequestResponse(request, onError)
      return onError
    })
  )
}

export const requestImagePromise = (request: Request): Promise<ImageDataOrError> => {
  const { response } = request
  if (isClientImage(response)) return Promise.resolve({ data: response })

  makeRequestEndpointAbsolute(request)
  return requestProtocolPromise(request).then(protocolPlugin => 
    protocolPlugin.promise(request, ImageType).then(onError => {
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

export const requestVideoPromise = (request: Request): Promise<VideoDataOrError> => {
  const { response } = request
  if (isClientVideo(response)) return Promise.resolve({ data: response })

  makeRequestEndpointAbsolute(request)
  return requestProtocolPromise(request).then(protocolPlugin => 
    protocolPlugin.promise(request, VideoType).then(onError => {
      setRequestResponse(request, onError)
      return onError
    })
  )
}

export const requestRecordPromise = (request: Request, useResponse = false): Promise<RecordDataOrError> => {
  if (useResponse) {
    const { response } = request
    if (isJsonRecord(response)) return Promise.resolve({ data: response })
  }
  makeRequestEndpointAbsolute(request)
  return requestProtocolPromise(request).then(protocolPlugin => 
    protocolPlugin.promise(request, RecordType).then(onError => {
      setRequestResponse(request, onError)
      return onError
    })
  )
}

export const requestRecordsPromise = (request: Request, useResponse = false): Promise<RecordsDataOrError> => {
  if (useResponse) {
    const { response } = request
    if (isJsonRecords(response)) return Promise.resolve({ data: response })
  }
  makeRequestEndpointAbsolute(request)
  return requestProtocolPromise(request).then(protocolPlugin => 
    protocolPlugin.promise(request, RecordsType).then(onError => {
      setRequestResponse(request, onError)
      return onError
    })
  )
}

export const requestRawPromise = (request: Request, type: RawType): Promise<MediaDataOrError> => {
  switch(type) {
    case AudioType: return requestAudioPromise(request)
    case ImageType: return requestImagePromise(request)
    case VideoType: return requestVideoPromise(request)
  }
}

export const requestMediaPromise = (request: Request, type: LoadType): Promise<MediaDataOrError> => {
  switch(type) {
    case AudioType: 
    case ImageType: 
    case VideoType: return requestRawPromise(request, type)
    case FontType: return requestFontPromise(request)
    // default: return requestRecordPromise(request)
  }
  return errorPromise(ErrorName.Type)
}


export const requestPromise = (request: Request, type?: string): Promise<PathDataOrError> => {
  makeRequestEndpointAbsolute(request)
  return requestProtocolPromise(request).then(protocolPlugin => 
    protocolPlugin.promise(request, type)
  )
}
