import { GraphFile, GraphFiles } from "../MoveMe"
import { Definition } from "../Definition/Definition"
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

export interface LoaderSource {
  result?: any
  promise?: Promise<void>
  loaded: boolean
  definitions: Map<string, Definition>
}

export interface LoaderFile {
  definitions: Map<string, Definition>
  promise: Promise<void>
  result?: any
  loadedInfo?: LoadedInfo
  loaded?: boolean
}

export interface Loader {
  flushFilesExcept(graphFiles?: GraphFiles): void
  getFile(graphFile: GraphFile): any
  key(graphFile: GraphFile): string
  loadedFile(graphFile: GraphFile): boolean
  loadFilePromise(graphFile: GraphFile): Promise<GraphFile>
  loadFilesPromise(files: GraphFiles): Promise<GraphFiles>
  loadingFile(graphFile: GraphFile): boolean
}
