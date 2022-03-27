import { Definition } from "../Base/Definition"
import { Any, GraphFile, GraphFiles } from "../declarations"
import { GraphType } from "../Setup/Enums"

export interface LoadedInfo {
  duration?: number
  width?: number
  height?: number
  audible?: boolean
  fps?: number
  label?: string
  error?: string
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
  fileInfoPromise(graphFile: GraphFile): Promise<LoadedInfo>
  flushFilesExcept(graphFiles?: GraphFiles): void
  getFile(graphFile: GraphFile): Any
  graphType: GraphType
  key(graphFile: GraphFile): string
  loadedFile(graphFile: GraphFile): boolean
  loadFilePromise(graphFile: GraphFile): Promise<GraphFile>
  loadFilesPromise(files: GraphFiles): Promise<GraphFiles>
  loadingFile(graphFile: GraphFile): boolean
}
