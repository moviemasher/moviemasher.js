import type { Identified } from '@moviemasher/runtime-shared'
import type { UnknownRecord } from '@moviemasher/runtime-shared'

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
