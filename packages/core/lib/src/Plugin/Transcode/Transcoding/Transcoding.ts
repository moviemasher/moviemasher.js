
import type {EncodingType} from '../../Encode/Encoding/Encoding.js'
import type {FontType, SequenceType} from '../../../Setup/Enums.js'
import type {Requestable, RequestableObject} from '../../../Base/Requestable/Requestable.js'

import { TypesEncoding} from '../../Encode/Encoding/Encoding.js'
import {TypeFont, TypeSequence} from '../../../Setup/Enums.js'

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



export type TranscodingType = EncodingType | FontType | SequenceType 
export type TranscodingTypes = TranscodingType[]
export const TypesTranscoding: TranscodingTypes = [...TypesEncoding, TypeFont, TypeSequence]

