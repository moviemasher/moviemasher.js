import { PotentialError } from "../../../Helpers/Error/Error"

import { DecodeOutput, DecoderOptions } from "../Decoder"


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


export interface LoadedInfo extends PotentialError {
  audible?: boolean
  duration?: number
  family?: string
  extension?: string
  alpha?: boolean
  fps?: number
  height?: number
  width?: number
  info?: CommandProbeData
}

export interface CommandProbeStream {
  [key: string]: any

  // avg_frame_rate?: string | undefined
  // bit_rate?: string | undefined
  // bits_per_raw_sample?: string | undefined
  // bits_per_sample?: number | undefined
  // channel_layout?: string | undefined
  // channels?: number | undefined
  // chroma_location?: string | undefined
  // codec_long_name?: string | undefined
  // codec_tag_string?: string | undefined
  // codec_tag?: string | undefined
  // codec_time_base?: string | undefined
  // coded_height?: number | undefined
  // coded_width?: number | undefined
  // color_primaries?: string | undefined
  // color_range?: string | undefined
  // color_space?: string | undefined
  // color_transfer?: string | undefined
  // display_aspect_ratio?: string | undefined
  // duration_ts?: string | undefined
  // field_order?: string | undefined
  // has_b_frames?: number | undefined
  // id?: string | undefined
  // level?: string | undefined
  // max_bit_rate?: string | undefined
  // nb_frames?: string | undefined
  // nb_read_frames?: string | undefined
  // nb_read_packets?: string | undefined
  // profile?: number | undefined
  // r_frame_rate?: string | undefined
  // refs?: number | undefined
  // sample_aspect_ratio?: string | undefined
  // sample_fmt?: string | undefined
  // sample_rate?: number | undefined
  // start_pts?: number | undefined
  // start_time?: number | undefined
  // time_base?: string | undefined
  // timecode?: string | undefined
  codec_name?: string | undefined
  codec_type?: string | undefined
  duration?: string | undefined
  height?: number | undefined
  pix_fmt?: string | undefined
  rotation?: string | number | undefined
  width?: number | undefined
}

export interface CommandProbeFormat {
  // filename?: string | undefined
  // nb_streams?: number | undefined
  // nb_programs?: number | undefined
  // format_name?: string | undefined
  format_long_name?: string | undefined
  // start_time?: number | undefined
  duration?: number | undefined
  // size?: number | undefined
  // bit_rate?: number | undefined
  probe_score?: number | undefined
  tags?: Record<string, string | number> | undefined
}

export interface CommandProbeData {
  streams: CommandProbeStream[]
  format: CommandProbeFormat
}
