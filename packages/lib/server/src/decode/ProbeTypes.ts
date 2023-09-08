import type { DecodeOptions } from '@moviemasher/runtime-shared'
import type { DecodeOutput } from './DecodeTypes.js'

export type AlphaProbe = 'alpha'
export type AudibleProbe = 'audible'
export type DurationProbe = 'duration'
export type SizeProbe = 'size'

export type ProbeKind = string | AlphaProbe | AudibleProbe | DurationProbe | SizeProbe
export type ProbeKinds = ProbeKind[]

export interface ProbeOptions extends DecodeOptions {
  types: ProbeKinds
}

export interface ProbeOutput extends DecodeOutput {
  options: ProbeOptions
}




