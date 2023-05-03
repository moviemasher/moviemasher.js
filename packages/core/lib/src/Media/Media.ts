import type { UnknownRecord } from '../Types/Core.js'
import type { Constrained } from '../Base/Constrained.js'
import type { PreloadArgs, ServerPromiseArgs } from '../Base/Code.js'
import type { Property } from '../Setup/Property.js'
import type { Size } from '../Utility/Size.js'
import type { TranscodingObjects, Transcodings, TranscodingTypes } from '../Plugin/Transcode/Transcoding/Transcoding.js'
import type { MediaType } from '../Setup/MediaType.js'
import type { Identified } from '../Base/Identified.js'
import type { Propertied } from '../Base/Propertied.js'
import type { DecodingObjects, Decodings } from '../Plugin/Decode/Decoding/Decoding.js'
import type { ClientAudioDataOrError, ClientFontDataOrError, ClientImageDataOrError, ClientMediaDataOrError, ClientVideoDataOrError, Data } from '../Helpers/ClientMedia/ClientMedia.js'
import type { DefiniteError } from '../Helpers/Error/Error.js'
import type { Requestable, RequestableObject } from '../Base/Requestable/Requestable.js'
import type { EndpointRequest } from '../Helpers/Request/Request.js'

export interface MediaInstanceObject extends UnknownRecord {
  mediaId?: string
  definition?: Media
  label?: string
}

export interface MediaInstance extends Identified, Propertied {
  definition: Media
  mediaId: string
  definitionIds(): string[]
  label: string
  type: MediaType
  unload(): void

  serverPromise(args: ServerPromiseArgs): Promise<void>
}

export type MediaInstanceClass = Constrained<MediaInstance>

export interface MediaObject extends RequestableObject {
  file?: File
  type?: MediaType | string
  transcodings?: TranscodingObjects
  decodings?: DecodingObjects
  label?: string
}
export type MediaObjects = MediaObject[]


export interface MediaObjectData extends Data {
  data: MediaObject
}
export type MediaObjectDataOrError = DefiniteError | MediaObjectData

/**
 * @category Media
 */
export interface Media extends Requestable {
  type: MediaType
  transcodings: Transcodings
  decodings: Decodings

  serverPromise(args: ServerPromiseArgs): Promise<void>
  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined
  instanceFromObject(object?: MediaInstanceObject): MediaInstance
  instanceArgs(object?: MediaInstanceObject): MediaInstanceObject
  eventTarget?: EventTarget
  file?: File
  isVector: boolean
  label: string
  preferredTranscoding(...types: TranscodingTypes): Requestable
  properties: Property[]

  requestAudioPromise(request: EndpointRequest): Promise<ClientAudioDataOrError> 
  requestFontPromise(request: EndpointRequest): Promise<ClientFontDataOrError> 
  requestImagePromise(request: EndpointRequest): Promise<ClientImageDataOrError> 
  requestVideoPromise(request: EndpointRequest): Promise<ClientVideoDataOrError> 



  toJSON(): UnknownRecord
  loadPromise(args: PreloadArgs): Promise<void>
  unload(): void
}

export type MediaArray = Media[]


export type MediaClass = Constrained<Media>

export type MediaFactoryMethod = (_mediaObject: MediaObject) => Media



export interface ClientMediaEventDetail {
  request: EndpointRequest
  promise? : Promise<ClientMediaDataOrError>
}

export type ClientMediaEvent = CustomEvent<ClientMediaEventDetail>

export interface ClientAudioEventDetail {
  request: EndpointRequest
  promise? : Promise<ClientAudioDataOrError>
}

export type ClientAudioEvent = CustomEvent<ClientAudioEventDetail>


export interface ClientFontEventDetail {
  request: EndpointRequest
  promise? : Promise<ClientFontDataOrError>
}

export type ClientFontEvent = CustomEvent<ClientFontEventDetail>



export interface ClientImageEventDetail {
  request: EndpointRequest
  promise? : Promise<ClientImageDataOrError>
}

export type ClientImageEvent = CustomEvent<ClientImageEventDetail>



export interface ClientVideoEventDetail {
  request: EndpointRequest
  promise? : Promise<ClientVideoDataOrError>
}

export type ClientVideoEvent = CustomEvent<ClientVideoEventDetail>
