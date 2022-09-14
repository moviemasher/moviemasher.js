import { LoadedAudio, LoadedFont, LoadedImage, LoadedSvgImage, LoadedVideo, Scalar, ScalarObject, Value } from "../declarations"
import { GraphFile, GraphFiles } from "../MoveMe"
import { Definition, DefinitionObject } from "../Definition/Definition"
import { GraphFileType, isGraphFileType, isLoadType, LoadType } from "../Setup/Enums"
import { throwError } from "../Utility/Throw"
import { isPopulatedString } from "../Utility/Is"

export type LoadedImageOrVideo = LoadedImage | LoadedVideo
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
export interface LoadedInfo extends Partial<ErrorObject> {
  audible?: boolean
  duration?: number
  family?: string
  fps?: number
  height?: number
  width?: number
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
  flushFilesExcept(graphFiles?: GraphFiles): void
  getCache(path: LoaderPath): LoaderCache | undefined
  getError(graphFile: GraphFile): any 
  getFile(graphFile: GraphFile): any
  info(loaderPath: LoaderPath): LoadedInfo | undefined
  key(graphFile: GraphFile): string
  loadedFile(graphFile: GraphFile): boolean
  loadFilesPromise(files: GraphFiles): Promise<void>
  loadPromise(urlPath: string, definition?: Definition): Promise<any> 
  sourceUrl(graphFile: GraphFile): string
}
