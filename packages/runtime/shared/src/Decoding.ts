import type { UnknownRecord } from './Core.js'
import type { Identified } from './Identified.js'

export interface Decoding extends Partial<Identified> {
  type: DecodingType
  data?: UnknownRecord
}
export type Decodings = Decoding[]

export interface DecodingObject {
  type: DecodingType
  data?: UnknownRecord
}

export type DecodingObjects = DecodingObject[]


export type DecodingType = string | ProbeType

export type DecodingTypes = DecodingType[]


export type ProbeType = 'probe'



