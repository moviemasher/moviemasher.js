import { Identified } from "../../../Base/Identified"
import { UnknownRecord } from "../../../Types/Core"

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
export const ProbeType: ProbeType = 'probe'

export type DecodingType = ProbeType
export type DecodingTypes = DecodingType[]
export const DecodingTypes: DecodingTypes = [ProbeType]
export const isDecodingType = (value: any): value is DecodingType => DecodingTypes.includes(value)
