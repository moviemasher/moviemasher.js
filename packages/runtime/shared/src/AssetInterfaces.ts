import type { AssetType, AssetTypes } from './AssetType.js'
import type { Labeled } from './Base.js'
import type { AssetCacheArgs } from './CacheTypes.js'
import type { ClipObject } from './ClipObject.js'
import type { StringRecord, Strings, Value } from './Core.js'
import type { DataOrError } from './DataOrError.js'
import type { Decodings } from './CodeTypes.js'
import type { Identified } from './Identified.js'
import type { Instance, InstanceArgs, InstanceObject } from './InstanceTypes.js'
import type { Propertied } from './Propertied.js'
import type { Size } from './Size.js'
import type { Source, Sourced, Sources } from './SourceType.js'
import type { Typed } from './Typed.js'

export interface Asset extends Propertied, Identified, Typed, Labeled {
  asset(assetIdOrObject: string | AssetObject): Asset 
  assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>>
  assetIds: Strings
  assetObject: AssetObject
  assets: Assets
  canBeContainer: boolean
  canBeContent: boolean
  container: boolean
  content: boolean
  decodings: Decodings
  instanceArgs(object?: InstanceObject): InstanceArgs
  instanceFromObject(object?: InstanceObject): Instance
  clipObject(object?: InstanceObject): ClipObject
  isVector: boolean
  source: Source
  type: AssetType  
}

export interface Assets extends Array<Asset>{}

export interface AssetObject extends Identified, Labeled, Sourced, Typed {
  created?: string
  assets?: AssetObjects
  type: AssetType 
  decodings?: Decodings
}

export interface AssetObjects extends Array<AssetObject>{}

export interface AudibleAsset extends Asset {
  audio: boolean
  audioUrl: string
  duration: number
  frames(quantize: number): number
  loop: boolean
}

export interface AudibleAssetObject extends AssetObject {
  duration?: number
  audio?: boolean
  loop?: boolean
  waveform?: string
  audioUrl?: string
}

export interface VisibleAsset extends Asset {
  sourceSize?: Size
  alpha?: boolean
}

export interface VisibleAssetObject extends AssetObject {
  sourceSize?: Size
  previewSize?: Size
}

export interface SourceAsset extends Asset {
  source: Source
}

export type StringOrRecord = string | StringRecord

export interface StringOrRecords extends Array<StringOrRecord>{}

export interface AssetParams {
  types?: AssetTypes | AssetType
  sources?: Sources | Source
  terms?: Strings | string
}

export interface AssetObjectsResponse {
  assets: AssetObject[]
  cacheControl?: string
}
