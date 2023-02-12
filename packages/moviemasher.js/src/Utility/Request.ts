import { ClientAudioOrError, ClientFontOrError, ClientImageOrError, ClientMediaOrError, ClientVideoOrError, JsonRecordOrError } from "../Load/Loaded"
import { RequestObject } from "../Api/Api"
import { protocolLoadPromise } from "../Plugin/Protocol/Protocol"
import { endpointAbsolute } from "../Helpers/Endpoint/EndpointFunctions"
import { assertPopulatedString } from "./Is"
import { AudioType, FontType, ImageType, JsonType, LoadType, VideoType } from "../Setup/Enums"
import { PathOrError } from "../Helpers/Error/Error"
import { errorPromise } from "../Helpers/Error/ErrorFunctions"
import { ErrorName } from "../Helpers/Error/ErrorName"

export const requestProtocol = (request: RequestObject): string => {
  const { endpoint } = request
  const absolute = endpointAbsolute(endpoint)
  const { protocol } = absolute
  assertPopulatedString(protocol)
  return protocol
}

export const requestAudioPromise = (request: RequestObject): Promise<ClientAudioOrError> => {
  return protocolLoadPromise(requestProtocol(request)).then(adaptor => 
    adaptor.promise(request, AudioType)
  )
}

export const requestFontPromise = (request: RequestObject): Promise<ClientFontOrError> => {
  return protocolLoadPromise(requestProtocol(request)).then(adaptor => 
    adaptor.promise(request, FontType)
  )
}

export const requestImagePromise = (request: RequestObject): Promise<ClientImageOrError> => {
  return protocolLoadPromise(requestProtocol(request)).then(adaptor => 
    adaptor.promise(request, ImageType)
  )
}

export const requestVideoPromise = (request: RequestObject): Promise<ClientVideoOrError> => {
  return protocolLoadPromise(requestProtocol(request)).then(adaptor => 
    adaptor.promise(request, VideoType)
  )
}

export const requestJsonPromise = (request: RequestObject): Promise<JsonRecordOrError> => {
  return protocolLoadPromise(requestProtocol(request)).then(adaptor => 
    adaptor.promise(request, JsonType)
  )
}

export const requestMediaPromise = (request: RequestObject, type: LoadType): Promise<ClientMediaOrError> => {
  switch(type) {
    case AudioType: return requestAudioPromise(request)
    case ImageType: return requestImagePromise(request)
    case VideoType: return requestVideoPromise(request)
    case FontType: return requestFontPromise(request)
    case JsonType: return errorPromise(ErrorName.Type)
  }
}


export const requestPromise = (request: RequestObject, type?: string): Promise<PathOrError> => {
  return protocolLoadPromise(requestProtocol(request)).then(adaptor => 
    adaptor.promise(request, type)
  )
}

export const requestExtension = (request: RequestObject): string => {
  const { endpoint } = request
  const { pathname = '' } = endpoint
  const last = pathname.split('.').pop() || ''
  return last.trim()
}
