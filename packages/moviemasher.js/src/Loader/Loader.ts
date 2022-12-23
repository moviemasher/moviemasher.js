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

export interface LoadedInfo extends Partial<ErrorObject> {
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
  info(loaderPath: LoaderPath): LoadedInfo | undefined
  loaded(urlPath: string): boolean
  loadPromise(urlPath: string | string[], definition?: Definition): Promise<any> 

  // RenderingOutputClass, FilterGraphsClass
  loadFilesPromise(files: GraphFiles): Promise<void>
  // FilterGraphClass, RenderingProcessClass
  key(graphFile: GraphFile): string
  
  sourceUrl(graphFile: GraphFile): string
}
