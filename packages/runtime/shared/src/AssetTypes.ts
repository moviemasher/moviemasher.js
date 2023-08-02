import type { AssetType } from './AssetType.js'
import type { Labeled } from './Base.js'
import type { CacheOptions } from './CacheTypes.js'
import { ClipObject } from './ClipObject.js'
import type { Strings } from './Core.js'
import type { DecodingObjects, Decodings } from './Decoding.js'
import type { Identified } from './Identified.js'
import type { InstanceObject, InstanceArgs, Instance } from './InstanceTypes.js'
import type { Propertied } from './Propertied.js'
import type { Size } from './Size.js'
import type { Source } from './SourceType.js'
import type { Transcodings, TranscodingTypes, Transcoding, TranscodingObjects } from './Transcoding.js'
import type { Typed } from './Typed.js'

export interface Asset extends Propertied, Identified, Typed, Labeled {
  assetCachePromise(args: CacheOptions): Promise<void>
  assetIds: Strings
  canBeContainer: boolean
  canBeContent: boolean
  container: boolean
  content: boolean
  decodings: Decodings
  instanceArgs(object?: InstanceObject): InstanceArgs
  instanceFromObject(object?: InstanceObject): Instance
  clipObject(object?: InstanceObject): ClipObject
  isVector: boolean
  preferredTranscoding(...types: TranscodingTypes): Transcoding | undefined 
  source: Source
  transcodings: Transcodings
  type: AssetType  
}

export type Assets = Asset[]

export interface AssetObject extends Identified, Typed, Labeled {
  type: AssetType  
  source: Source
  decodings?: DecodingObjects
  transcodings?: TranscodingObjects
}

export type AssetObjects = AssetObject[]

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
  previewSize?: Size
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
