
import type { AudioType, ImageType, VideoType } from '@moviemasher/runtime-shared'
import type { Requestable, RequestableObject } from '../../../Base/Requestable/Requestable.js'


export interface Encoding extends Requestable {}
export type Encodings = Encoding[]

export interface EncodingObject extends RequestableObject {}
export type EncodingObjects = EncodingObject[]

export type EncodingType = AudioType | ImageType | VideoType
export type EncodingTypes = EncodingType[]
