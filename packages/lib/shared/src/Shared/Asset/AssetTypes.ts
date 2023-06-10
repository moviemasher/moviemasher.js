
import type { Strings } from '@moviemasher/runtime-shared'
import type { Identified } from '@moviemasher/runtime-shared'
import type { Propertied } from '@moviemasher/runtime-shared'
import type { Typed } from '@moviemasher/runtime-shared'
import type { Source } from '@moviemasher/runtime-shared'
import type { AssetType } from '@moviemasher/runtime-shared'
import type { Size } from '@moviemasher/runtime-shared'

import type { Instance, InstanceArgs, InstanceObject} from '../Instance/Instance.js'
import type { Transcoding, TranscodingTypes, Transcodings } from '../../Plugin/Transcode/Transcoding/Transcoding.js'

import type { Decodings } from '../../Plugin/Decode/Decoding/Decoding.js'
import type { CacheOptions } from "../../Base/CacheTypes.js"
import { Labeled } from '@moviemasher/runtime-shared'


export interface Asset extends Identified, Propertied, Typed, Labeled {
  assetCachePromise(args: CacheOptions): Promise<void>
  assetIds: Strings
  container: boolean
  content: boolean
  decodings: Decodings

  transcodings: Transcodings
  preferredAsset(...types: TranscodingTypes): Transcoding | undefined 

  instanceArgs(object?: InstanceObject): InstanceArgs
  instanceFromObject(object?: InstanceObject): Instance
  isVector: boolean
  source: Source
  type: AssetType  
}

export type Assets = Asset[]

export interface AssetObject extends Identified, Typed, Labeled {
  type: AssetType  
  source: Source
  decodings?: Decodings
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
