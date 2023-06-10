import type { DecodeOutput } from '../Decode.js'

export const ProbeAlpha: AlphaProbe = 'alpha'
export const ProbeAudible: AudibleProbe = 'audible'
export const ProbeDuration: DurationProbe = 'duration'
export const ProbeSize: SizeProbe = 'size'
export type AlphaProbe = 'alpha'
export type AudibleProbe = 'audible'
export type DurationProbe = 'duration'
export type SizeProbe = 'size'

export type ProbeKind = string | AlphaProbe | AudibleProbe | DurationProbe | SizeProbe
export type ProbeKinds = ProbeKind[]
export const KindsProbe: ProbeKinds = [ProbeAlpha, ProbeAudible, ProbeDuration, ProbeSize]

export interface ProbeOptions {
  types: ProbeKinds
}

export interface ProbeOutput extends DecodeOutput {
  options: ProbeOptions
}


