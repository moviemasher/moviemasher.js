import type { DecodeOptions, Decoding, ProbeType } from './CodeTypes.js'
import type { UnknownRecord } from './Core.js'
import type { RawProbeData } from './Probing.js'

export type AlphaProbing = 'alpha'
export type AudibleProbing = 'audible'
export type DurationProbing = 'duration'
export type SizeProbing = 'size'

export type ProbingType = string | AlphaProbing | AudibleProbing | DurationProbing | SizeProbing
export interface ProbingTypes extends Array<ProbingType>{}

export interface ProbingOptions extends DecodeOptions {
  types: ProbingTypes
}

export interface Probing extends Decoding {
  type: ProbeType
  data: ProbingData
}

export interface ProbingData extends UnknownRecord {
  audible?: boolean
  duration?: number
  family?: string
  extension?: string
  alpha?: boolean
  fps?: number
  height?: number
  width?: number
  raw?: RawProbeData
}
