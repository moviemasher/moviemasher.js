import { UnknownRecord } from "../Types/Core"
import { Constrained } from "../Base/Constrained"
import { PreloadArgs, ServerPromiseArgs } from "../Base/Code"
import { Property } from "../Setup/Property"
import { Size } from "../Utility/Size"
import { TranscodingObjects, Transcodings } from "../Plugin/Transcode/Transcoding/Transcoding"
import { MediaType } from "../Setup/MediaType"
import { Identified } from "../Base/Identified"
import { Propertied } from "../Base/Propertied"
import { DecodingObjects, Decodings } from "../Plugin/Decode/Decoding/Decoding"
import { Data } from "../Helpers/ClientMedia/ClientMedia"
import { DefiniteError } from "../Helpers/Error/Error"
import { Requestable, RequestableObject } from "../Base/Requestable/Requestable"

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


export type MediaClass = Constrained<Media>

export type MediaFactoryMethod = (_: MediaObject) => Media

