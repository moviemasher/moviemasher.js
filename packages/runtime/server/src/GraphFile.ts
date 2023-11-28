import type { CacheOptions, ImportType } from '@moviemasher/runtime-shared'
import type { ServerAsset } from './ServerAsset.js'
import type { GraphFileType } from './GraphFileType.js'

export interface GraphFile {
  type: GraphFileType | ImportType
  file: string
  content?: string
  input?: boolean
  definition: ServerAsset
  resolved?: string
}
export interface GraphFiles extends Array<GraphFile>{}

export interface ServerPromiseArgs extends CacheOptions { }
