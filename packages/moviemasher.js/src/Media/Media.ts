import { Constrained, UnknownObject } from "../declarations"
import { ErrorObject } from "../Loader/Loader"
import { PreloadArgs } from "../MoveMe"
import { Property } from "../Setup/Property"
import { Size } from "../Utility/Size"
import { EncodingObjects } from "../Encode/Encoding/Encoding"
import { DecodingObjects, Decodings } from "../Decode/Decoding/Decoding"
import { isTranscoding, Transcoding, TranscodingObject } from "../Transcode/Transcoding/Transcoding"
import { TranscodingObjects, Transcodings } from "../Transcode/Transcoding/Transcoding"
import { DefinitionType, isDefinitionType } from "../Setup/Enums"
import { errorsThrow } from "../Utility/Errors"
import { MediaInstance, MediaInstanceObject } from "./MediaInstance/MediaInstance"


export interface MediaObject extends TranscodingObject {
  encodings?: EncodingObjects
  transcodings?: TranscodingObjects
  decodings?: DecodingObjects
  label?: string
  size?: number
}

export const isMediaObject = (value: any): value is MediaObject => {
  return isTranscoding(value) 
}

export type MediaObjects = MediaObject[]

export type MediaOrErrorObject = MediaObject | ErrorObject


export interface Media extends Transcoding {
  transcodings: Transcodings
  decodings: Decodings
  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined
  id: string
  instanceFromObject(object?: MediaInstanceObject): MediaInstance
  instanceArgs(object?: MediaInstanceObject): MediaInstanceObject

  isVector: boolean
  label: string
  preferredTranscoding(...types: DefinitionType[]): Transcoding
  properties: Property[]
  propertiesCustom: Property[]
  toJSON(): UnknownObject
  loadPromise(args: PreloadArgs): Promise<void>
  unload(): void
}

export type Medias = Media[]

export const isMedia = (value: any): value is Media => {
  return isTranscoding(value) && "type" in value && isDefinitionType(value.type)
}

export function assertMedia(value: any, name?: string): asserts value is Media {
  if (!isMedia(value)) errorsThrow(value, 'Media', name)
}

export type MediaClass = Constrained<Media>

export type MediaFactoryMethod = (_: MediaObject) => Media

