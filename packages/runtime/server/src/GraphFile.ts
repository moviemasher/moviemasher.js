import type { CacheOptions, LoadType } from '@moviemasher/runtime-shared'
import type { ServerAsset } from './ServerAsset.js'
import type { GraphFileType } from './GraphFileType.js'

export interface GraphFile {
  type: GraphFileType | LoadType
  file: string
  content?: string
  input?: boolean
  definition: ServerAsset
  resolved?: string
}
export interface GraphFiles extends Array<GraphFile>{}

export interface ServerPromiseArgs extends CacheOptions { }
