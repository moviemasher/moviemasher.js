import { LoadedAudio, LoadedFont, LoadedImage, LoadedImageOrVideo, LoadedSvgImage, LoadedVideo, Scalar, ScalarObject, Value } from "../declarations"
import { GraphFile, GraphFiles } from "../MoveMe"
import { Definition, DefinitionObject } from "../Definition/Definition"
import { GraphFileType, isGraphFileType, isLoadType, LoadType } from "../Setup/Enums"
import { throwError } from "../Utility/Throw"
import { isPopulatedString } from "../Utility/Is"

export type LoadedMedia = LoadedImageOrVideo | LoadedAudio

export const isLoadedVideo = (value: any): value is LoadedVideo => {
  return value instanceof HTMLVideoElement
}
export const isLoadedImage = (value: any): value is LoadedImage => {
  return value instanceof HTMLImageElement
}
export const isLoadedAudio = (value: any): value is LoadedAudio => {
  return value instanceof AudioBuffer
}

export interface ErrorObject {
  error: string
  label: string
  value?: Value
}
export type DefinitionOrErrorObject = DefinitionObject | ErrorObject
export type Loaded = LoadedFont | LoadedMedia | LoadedSvgImage | AudioBuffer

export interface CommandProbeStream {
  [key: string]: any

  codec_name?: string | undefined
  // codec_long_name?: string | undefined
  // profile?: number | undefined
  codec_type?: string | undefined
  // codec_time_base?: string | undefined
  // codec_tag_string?: string | undefined
  // codec_tag?: string | undefined
  width?: number | undefined
  height?: number | undefined
  // coded_width?: number | undefined
  // coded_height?: number | undefined
  // has_b_frames?: number | undefined
  // sample_aspect_ratio?: string | undefined
  // display_aspect_ratio?: string | undefined
  pix_fmt?: string | undefined
  // level?: string | undefined
  // color_range?: string | undefined
  // color_space?: string | undefined
  // color_transfer?: string | undefined
  // color_primaries?: string | undefined
  // chroma_location?: string | undefined
  // field_order?: string | undefined
  // timecode?: string | undefined
  // refs?: number | undefined
  // id?: string | undefined
  // r_frame_rate?: string | undefined
  // avg_frame_rate?: string | undefined
  // time_base?: string | undefined
  // start_pts?: number | undefined
  // start_time?: number | undefined
  // duration_ts?: string | undefined
  duration?: string | undefined
  // bit_rate?: string | undefined
  // max_bit_rate?: string | undefined
  // bits_per_raw_sample?: string | undefined
  // nb_frames?: string | undefined
  // nb_read_frames?: string | undefined
  // nb_read_packets?: string | undefined
  // sample_fmt?: string | undefined
  // sample_rate?: number | undefined
  // channels?: number | undefined
  // channel_layout?: string | undefined
  // bits_per_sample?: number | undefined
  rotation?: string | number | undefined
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

export interface LoadedInfo extends Partial<ErrorObject> {
  audible?: boolean
  duration?: number
  family?: string
  extension?: string
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
  if (!isLoaderType(value)) throwError(value, "LoaderType", name)
}

export type LoaderPath = string
export const isLoaderPath = (value: any): value is LoaderPath => { 
  return isPopulatedString(value) && value.includes(':')
}
export function assertLoaderPath(value: any, name?: string): asserts value is LoaderPath {
  if (!isLoaderPath(value)) throwError(value, "LoaderPath", name)
}
export interface LoaderFile {
  loaderPath: LoaderPath
  loaderType: LoaderType
  options?: ScalarObject
  urlOrLoaderPath: LoaderPath
}
export type LoaderFiles = LoaderFile[]

export interface LoaderCache {
  error?: any
  definitions: Definition[]
  loaded: boolean
  loadedInfo?: LoadedInfo
  promise?: Promise<Loaded>
  result?: Loaded
}

export interface Loader {
  flushFilesExcept(fileUrls?: GraphFiles): void
  getCache(path: LoaderPath): LoaderCache | undefined
  getError(graphFile: GraphFile): any 
  info(loaderPath: LoaderPath): LoadedInfo | undefined
  key(graphFile: GraphFile): string
  loadedFile(graphFile: GraphFile): boolean
  loadFilesPromise(files: GraphFiles): Promise<void>
  loadPromise(urlPath: string, definition?: Definition): Promise<any> 
  sourceUrl(graphFile: GraphFile): string
}
