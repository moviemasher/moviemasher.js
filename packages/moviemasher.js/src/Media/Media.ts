import { UnknownRecord } from "../declarations"
import { Constrained } from "../Base/Constrained"
import { PreloadArgs } from "../Base/Code"
import { Property } from "../Setup/Property"
import { Size } from "../Utility/Size"
import { DecodingObjects, Decodings } from "../Decode/Decoding/Decoding"
import { isTranscoding } from "../Transcode/Transcoding/Transcoding"
import { TranscodingObjects, Transcodings } from "../Transcode/Transcoding/Transcoding"
import { MediaType, isMediaType } from "../Setup/Enums"
import { errorThrow } from "../Helpers/Error/ErrorFunctions"
import { MediaInstance, MediaInstanceObject } from "./MediaInstance/MediaInstance"
import { isRequestableObject, Requestable, RequestableObject } from "../Base/Requestable/Requestable"
import { PotentialError } from "../Helpers/Error/Error"


export interface MediaObject extends RequestableObject {
  file?: File
  type?: MediaType | string
  transcodings?: TranscodingObjects
  decodings?: DecodingObjects
  label?: string
  // size?: number
}

export const isMediaObject = (value: any): value is MediaObject => {
  return isRequestableObject(value) 
}

export type MediaObjects = MediaObject[]

export interface MediaObjectOrError extends PotentialError {
  mediaObject?: MediaObject
} 


export interface Media extends Requestable {
  type: MediaType
  transcodings: Transcodings
  decodings: Decodings
  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined
  instanceFromObject(object?: MediaInstanceObject): MediaInstance
  instanceArgs(object?: MediaInstanceObject): MediaInstanceObject
  file?: File
  isVector: boolean
  label: string
  preferredTranscoding(...types: MediaType[]): Requestable
  properties: Property[]
  toJSON(): UnknownRecord
  loadPromise(args: PreloadArgs): Promise<void>
  unload(): void
}

export type MediaArray = Media[]

export const isMedia = (value: any): value is Media => {
  return isTranscoding(value) && "type" in value && isMediaType(value.type)
}

export function assertMedia(value: any, name?: string): asserts value is Media {
  if (!isMedia(value)) errorThrow(value, 'Media', name)
}

export type MediaClass = Constrained<Media>

export type MediaFactoryMethod = (_: MediaObject) => Media

