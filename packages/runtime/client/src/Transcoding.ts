import type { TranscodingType } from '@moviemasher/runtime-shared'
import type { RequestableObject, Requestable } from './Requestable.js'

export interface TranscodingObject extends RequestableObject {
  type?: TranscodingType | string
  purpose?: string
}

export type TranscodingObjects = TranscodingObject[]

export interface Transcoding extends Requestable {
  type: TranscodingType
  purpose: string
}

export type Transcodings = Transcoding[]

