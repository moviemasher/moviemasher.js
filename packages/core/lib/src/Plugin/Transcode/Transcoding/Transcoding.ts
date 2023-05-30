
import type {
  FontType, SequenceType,  WaveformType
} from '../../../Setup/Enums.js'
import type {
  Requestable, RequestableObject
} from '../../../Base/Requestable/Requestable.js'
import { EncodingType } from '../../Encode/Encoding/Encoding.js'


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



export type TranscodingType = EncodingType | FontType | SequenceType | WaveformType
export type TranscodingTypes = TranscodingType[]
