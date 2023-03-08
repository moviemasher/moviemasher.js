import /* type */ { DecodeOutput, DecoderOptions } from "../Decode"

export type AlphaProbe = 'alpha'
export const AlphaProbe: AlphaProbe = 'alpha'


export type AudibleProbe = 'audible'
export const AudibleProbe: AudibleProbe = 'audible'


export type DurationProbe = 'duration'
export const DurationProbe: DurationProbe = 'duration'


export type SizeProbe = 'size'
export const SizeProbe: SizeProbe = 'size'


export type ProbeKind = string | AlphaProbe | AudibleProbe | DurationProbe | SizeProbe
export type ProbeKinds = ProbeKind[]
export const ProbeKinds: ProbeKinds = [AlphaProbe, AudibleProbe, DurationProbe, SizeProbe]

export interface ProbeOptions extends DecoderOptions {
  types: ProbeKinds
}

export interface ProbeOutput extends DecodeOutput {
  options: ProbeOptions
}


