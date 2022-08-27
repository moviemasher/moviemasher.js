import { GraphFile, GraphFiles } from "../MoveMe"
import { Definition, DefinitionObject } from "../Definition/Definition"
import { GraphType, LoadType } from "../Setup/Enums"
import { PreloadableDefinition } from "../Mixin/Preloadable/Preloadable"

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
  definitions: Definition[]
}

export interface LoaderFile {
  definitions: Definition[]
  promise?: Promise<void>
  result?: any
  loadedInfo?: LoadedInfo
  loaded?: boolean
}

export interface Loader {
  loadDefinitionObject(definition: DefinitionObject, object: any, loadedInfo?: LoadedInfo, key?: string): string
  flushFilesExcept(graphFiles?: GraphFiles): void
  getFile(graphFile: GraphFile): any
  key(graphFile: GraphFile): string
  loadedFile(graphFile: GraphFile): boolean
  loadFilesPromise(files: GraphFiles): Promise<GraphFiles>
  loadingFile(graphFile: GraphFile): boolean
}
