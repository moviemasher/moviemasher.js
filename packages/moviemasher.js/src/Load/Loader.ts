import { Value } from "../declarations"
import { LoadedAudio, LoadedFont, LoadedImage, LoadedMedia, LoadedVideo } from "./Loaded"
import { GraphFileType, isGraphFileType, isLoadType, LoadType } from "../Setup/Enums"
import { errorThrow } from "../Helpers/Error/ErrorFunctions"
import { isJsonRecord, isObject } from "../Utility/Is"
import { PotentialError } from "../Helpers/Error/Error"


export const isLoadedVideo = (value: any): value is LoadedVideo => {
  return isObject(value) && value instanceof HTMLVideoElement
}
export function assertLoadedVideo(value: any, name?: string): asserts value is LoadedVideo {
  if (!isLoadedVideo(value)) errorThrow(value, "LoadedVideo", name)
}

export const isLoadedImage = (value: any): value is LoadedImage => {
  return isObject(value) && value instanceof HTMLImageElement
}
export function assertLoadedImage(value: any, name?: string): asserts value is LoadedImage {
  if (!isLoadedImage(value)) errorThrow(value, "LoadedImage", name)
}

export const isLoadedAudio = (value: any): value is LoadedAudio => {
  return isObject(value) && value instanceof AudioBuffer
}
export function assertLoadedAudio(value: any, name?: string): asserts value is LoadedAudio {
  if (!isLoadedAudio(value)) errorThrow(value, "LoadedAudio", name)
}


export const isLoadedFont = (value: any): value is LoadedFont => {
  return isObject(value) && "family" in value
}
export function assertLoadedFont(value: any, name?: string): asserts value is LoadedFont {
  if (!isLoadedFont(value)) errorThrow(value, "LoadedFont", name)
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
export type LoaderType = GraphFileType | LoadType
export const isLoaderType = (value: any): value is LoaderType => { 
  return isLoadType(value) || isGraphFileType(value)
}
export function assertLoaderType(value: any, name?: string): asserts value is LoaderType {
  if (!isLoaderType(value)) errorThrow(value, "LoaderType", name)
}

export const isClientMedia = (value: any): value is LoadedMedia => (
  isLoadedAudio(value) || 
  isLoadedFont(value) || 
  isLoadedImage(value) || 
  isLoadedVideo(value) || 
  isJsonRecord(value)
)
export function assertClientMedia(value: any, name?: string): asserts value is LoadedMedia {
  if (!isClientMedia(value)) errorThrow(value, 'ClientMedia', name)
}

