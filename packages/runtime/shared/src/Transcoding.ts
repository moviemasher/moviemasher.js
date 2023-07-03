import type { ImportType } from './ImportType.js'
import type { Requestable, RequestableObject } from './Requestable.js'

export type SequenceType = 'sequence'
export type WaveformType = 'waveform'

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

export type TranscodingType = ImportType | SequenceType | WaveformType
export type TranscodingTypes = TranscodingType[]
