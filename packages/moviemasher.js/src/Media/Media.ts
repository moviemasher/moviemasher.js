import { UnknownRecord } from "../declarations"
import { Constrained } from "../Base/Constrained"
import { PreloadArgs, ServerPromiseArgs } from "../Base/Code"
import { Property } from "../Setup/Property"
import { Size } from "../Utility/Size"
import { isTranscoding } from "../Transcode/Transcoding/Transcoding"
import { TranscodingObjects, Transcodings } from "../Transcode/Transcoding/Transcoding"
import { MediaType, isMediaType } from "../Setup/Enums"
import { errorThrow } from "../Helpers/Error/ErrorFunctions"
import { isRequestableObject, Requestable, RequestableObject } from "../Base/Requestable/Requestable"
import { PathOrError, PotentialError } from "../Helpers/Error/Error"
import { isObject } from "../Utility/Is"
import { Identified } from "../Base/Identified"
import { Propertied } from "../Base/Propertied"
import { DecodingObjects, Decodings } from "../Plugin/Decode/Decoding/Decoding"

export interface MediaInstanceObject extends UnknownRecord {
  mediaId?: string
  definition?: Media
  label?: string
}
export const isMediaInstanceObject = (value?: any): value is MediaInstanceObject => {
  return isObject(value) && ("mediaId" in value || "definition" in value)
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

export const isMediaInstance = (value?: any): value is MediaInstance => {
  return isObject(value) && "definitionIds" in value
}

export type MediaInstanceClass = Constrained<MediaInstance>



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


export interface MediaResponse extends PathOrError {}

