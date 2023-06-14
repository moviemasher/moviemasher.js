import type { ProbeType, DecodingType, DecodingTypes } from './Decoding.js'


export const TypeProbe: ProbeType = 'probe'
export const TypesDecoding: DecodingTypes = [TypeProbe]
export const isDecodingType = (value: any): value is DecodingType => TypesDecoding.includes(value)
