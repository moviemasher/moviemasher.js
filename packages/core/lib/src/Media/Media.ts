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
import type { Data } from '../Helpers/ClientMedia/ClientMedia.js'
import type { DefiniteError } from '../Helpers/Error/Error.js'
import type { Requestable, RequestableObject } from '../Base/Requestable/Requestable.js'

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
  preferredTranscoding(...types: TranscodingTypes): Requestable
  properties: Property[]
  toJSON(): UnknownRecord
  loadPromise(args: PreloadArgs): Promise<void>
  unload(): void
}

export type MediaArray = Media[]


export type MediaClass = Constrained<Media>

export type MediaFactoryMethod = (_: MediaObject) => Media

