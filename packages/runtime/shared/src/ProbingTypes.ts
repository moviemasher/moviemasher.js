import type { UnknownRecord } from './Core.js'
import type { Decoding, ProbeType } from './JobProduct.js'
import type { RawProbeData } from './Probing.js'

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
