import { LoadedAudio, LoadedFont, LoadedImage, LoadedVideo } from "../declarations"
import { RequestObject } from "../Api/Api"
import { protocolLoadPromise } from "../Protocol/Protocol"
import { endpointAbsolute } from "./Endpoint"
import { assertPopulatedString } from "./Is"
import { DefinitionType } from "../Setup/Enums"
import { PathOrError } from "../MoveMe"

export const requestProtocol = (request: RequestObject): string => {
  const { endpoint } = request
  const absolute = endpointAbsolute(endpoint)
  const { protocol } = absolute
  assertPopulatedString(protocol)
  return protocol
}

export const requestAudioPromise = (request: RequestObject): Promise<LoadedAudio> => {
  return protocolLoadPromise(requestProtocol(request)).then(adaptor => 
    adaptor.promise(request, DefinitionType.Audio)
  )
}

export const requestFontPromise = (request: RequestObject): Promise<LoadedFont> => {
  return protocolLoadPromise(requestProtocol(request)).then(adaptor => 
    adaptor.promise(request, DefinitionType.Font)
  )
}

export const requestImagePromise = (request: RequestObject): Promise<LoadedImage> => {
  return protocolLoadPromise(requestProtocol(request)).then(adaptor => 
    adaptor.promise(request, DefinitionType.Image)
  )
}

export const requestVideoPromise = (request: RequestObject): Promise<LoadedVideo> => {
  return protocolLoadPromise(requestProtocol(request)).then(adaptor => 
    adaptor.promise(request, DefinitionType.Video)
  )
}

export const requestPromise = (request: RequestObject, extension?: string): Promise<PathOrError> => {
  return protocolLoadPromise(requestProtocol(request)).then(adaptor => 
    adaptor.promise(request, extension)
  )
}

export const requestExtension = (request: RequestObject): string => {
  const { endpoint } = request
  const { pathname = '' } = endpoint
  const last = pathname.split('.').pop() || ''
  return last.trim()
}
