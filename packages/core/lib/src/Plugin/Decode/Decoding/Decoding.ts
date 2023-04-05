import type { Identified } from '../../../Base/Identified.js'
import type { UnknownRecord } from '../../../Types/Core.js'

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

export type ProbeType = 'probe'
export const TypeProbe: ProbeType = 'probe'

export type DecodingType = string | ProbeType
export type DecodingTypes = DecodingType[]
export const DecodingTypes: DecodingTypes = [TypeProbe]
export const isDecodingType = (value: any): value is DecodingType => DecodingTypes.includes(value)
