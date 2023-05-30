
import type { Identified, Time } from '@moviemasher/runtime-shared'
import type { Propertied } from '@moviemasher/runtime-shared'
import type { Typed } from '@moviemasher/runtime-shared'
import type { 
  
  Instance, InstanceArgs, InstanceObject} from '../Instance/Instance.js'
import type {  ImportedAssets } from '../Imported/ImportedTypes.js'
import type { Strings } from '@moviemasher/runtime-shared'
import type { Transcoding, TranscodingTypes, Transcodings } from '../../Plugin/Transcode/Transcoding/Transcoding.js'
import type { Source } from '@moviemasher/runtime-shared'
import type { AssetType } from '@moviemasher/runtime-shared'
import { Size } from '@moviemasher/runtime-shared'
import { Decodings } from '../../Plugin/Decode/Decoding/Decoding.js'
import { Labeled } from '../../Base/Base.js'
import { AssetCacheArgs, CacheOptions } from '../../Base/Code.js'

// new ColorContentDefinitionClass({
//   id: DefaultContentId,
//   label: 'Color',
//   type: 'image',
//   request: { response: { color: '#FFFFFF' }}
// }),
// new ShapeContainerDefinitionClass({
//   id: DefaultContainerId, 
//   label: 'Rectangle',
//   type: 'image',
//   kind: 'shape',
//   request: { response: { } }
// })


export interface Asset extends Identified, Propertied, Typed {
  assetCachePromise(args: CacheOptions): Promise<void>
  assetIds: Strings
  decodings: Decodings
  eventTarget?: EventTarget
  importedAssets: ImportedAssets
  instanceArgs(object?: InstanceObject): InstanceArgs
  instanceFromObject(object?: InstanceObject): Instance
  isVector: boolean
  label: string
  preferredAsset(...types: TranscodingTypes): Transcoding | undefined 
  source: Source
  transcodings: Transcodings
  type: AssetType  
}

export type Assets = Asset[]

export interface AssetObject extends Identified, Typed {
  label?: string
  type: AssetType  
  source?: Source
  decodings?: Decodings
}

export type AssetObjects = AssetObject[]

export interface SourceAssetObject extends AssetObject {
  source: Source
}

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




