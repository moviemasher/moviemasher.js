import { Constrained, UnknownObject } from "../declarations"
import { ErrorObject } from "../Loader/Loader"
import { PreloadableDefinitionObject } from "../Mixin/Preloadable/Preloadable"
import { PreloadArgs } from "../MoveMe"
import { Property } from "../Setup/Property"
import { Size } from "../Utility/Size"
import { EncodingObjects } from "../Edited/Mash/Encoding/Encoding"
import { ProbingObjects, Probings } from "./Probing/Probing"
import { isTranscoding, Transcoding, TranscodingObject } from "./Transcoding/Transcoding"
import { TranscodingObjects, Transcodings } from "./Transcoding/Transcoding"
import { DefinitionType, isMediaDefinitionType } from "../Setup/Enums"
import { errorsThrow } from "../Utility/Errors"
import { MediaInstance, MediaInstanceObject } from "./MediaInstance/MediaInstance"


export interface MediaObject extends TranscodingObject {
  encodings?: EncodingObjects
  transcodings?: TranscodingObjects
  probings?: ProbingObjects
  label?: string
  size?: number
}

export const isMediaObject = (value: any): value is MediaObject => {
  return isTranscoding(value) //&& isMediaDefinitionType(value.type)
}



export type MediaObjects = MediaObject[]

export type MediaOrErrorObject = MediaObject | ErrorObject


export type MediaTransitionalObject = MediaObject | PreloadableDefinitionObject 


export interface Media extends Transcoding {
  transcodings: Transcodings
  probings: Probings
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
  return isTranscoding(value) && "type" in value && isMediaDefinitionType(value.type)
}

export function assertMedia(value: any, name?: string): asserts value is Media {
  if (!isMedia(value)) errorsThrow(value, 'Media', name)
}

export type MediaClass = Constrained<Media>

export type MediaFactoryMethod = (_: MediaObject) => Media

