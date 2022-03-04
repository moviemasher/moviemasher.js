import { Definition } from "../Base/Definition"
import { Any, GraphFile, GraphFiles } from "../declarations"
import { GraphType } from "../Setup/Enums"

export interface LoadedInfo {
  duration?: number
  width?: number
  height?: number
  audible?: boolean
  fps?: number
}

export interface PreloaderSource {
  result?: Any
  promise?: Promise<void>
  loaded: boolean
  definitions: Map<string, Definition>
}
export interface PreloaderFile {
  definitions: Map<string, Definition>
  promise: Promise<void>
  result?: Any
  loadedInfo?: LoadedInfo
  loaded?: boolean
}

export interface Preloader {
  graphType: GraphType
  getFile(file: GraphFile): Any
  fileInfoPromise(file: GraphFile): Promise<LoadedInfo>
  flushFilesExcept(graphFiles?: GraphFiles): void
  key(file : GraphFile): string
  loadFilePromise(file : GraphFile): Promise<GraphFile>
  loadFilesPromise(files : GraphFiles): Promise<GraphFiles>
  loadedFile(file : GraphFile): boolean
  loadingFile(file : GraphFile): boolean
}
