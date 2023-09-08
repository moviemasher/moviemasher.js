import type { Asset, AssetObject, SourceAsset } from './AssetTypes.js'
import type { AssetType, AudioType, ImageType, VideoType } from './AssetType.js'
import type { AudioAssetObject } from './AudioAsset.js'
import type { ColorAssetObject } from './ColorTypes.js'
import type { ColorSource, MashSource, PromptSource, RawSource, ShapeSource, Source, TextSource } from './SourceType.js'
import type { ImageAssetObject } from './ImageAsset.js'
import type { MashAudioAssetObject, MashImageAssetObject, MashVideoAssetObject } from './MashTypes.js'
import type { PromptAudioAssetObject, PromptImageAssetObject, PromptVideoAssetObject } from './PromptTypes.js'
import type { RawAudioAssetObject, RawImageAssetObject, RawVideoAssetObject } from './RawTypes.js'
import type { ShapeAssetObject } from './ShapeTypes.js'
import type { TextAssetObject } from './TextTypes.js'
import type { VideoAssetObject } from './VideoAsset.js'

import { assertAssetType } from './AssetTypeAsserts.js'
import { assertIdentified, isIdentified } from './IdentifiedGuards.js'
import { assertTyped, isTyped } from './TypedGuards.js'
import { errorThrow } from './ErrorFunctions.js'
import { isAssetType } from './AssetTypeGuards.js'
import { isPopulatedString } from './TypeofGuards.js'

export const isAsset = (value: any): value is Asset => (
  isIdentified(value) 
  && isTyped(value) 
  && isAssetType(value.type) 
  && 'isVector' in value
)

export function assertAsset(value: any, name?: string): asserts value is Asset {
  assertIdentified(value, name)
  assertTyped(value, name)
  assertAssetType(value.type, name)
  if (!isAsset(value)) errorThrow(value, 'Asset', name)
}
export const isSourceAsset = (value: any): value is SourceAsset => (
  isAsset(value) && isPopulatedString(value.source)
)

export function isAssetObject(value: any, type?: undefined, source?: undefined): value is AssetObject 

export function isAssetObject(value: any, type?: AudioType, source?: undefined): value is AudioAssetObject 
export function isAssetObject(value: any, type?: ImageType, source?: undefined): value is ImageAssetObject 
export function isAssetObject(value: any, type?: VideoType, source?: undefined): value is VideoAssetObject 

export function isAssetObject(value: any, type?: AudioType, source?: RawSource): value is RawAudioAssetObject 
export function isAssetObject(value: any, type?: ImageType, source?: RawSource): value is RawImageAssetObject 
export function isAssetObject(value: any, type?: VideoType, source?: RawSource): value is RawVideoAssetObject 

export function isAssetObject(value: any, type?: AudioType, source?: MashSource): value is MashAudioAssetObject 
export function isAssetObject(value: any, type?: ImageType, source?: MashSource): value is MashImageAssetObject 
export function isAssetObject(value: any, type?: VideoType, source?: MashSource): value is MashVideoAssetObject 

export function isAssetObject(value: any, type?: AudioType, source?: PromptSource): value is PromptAudioAssetObject 
export function isAssetObject(value: any, type?: ImageType, source?: PromptSource): value is PromptImageAssetObject 
export function isAssetObject(value: any, type?: VideoType, source?: PromptSource): value is PromptVideoAssetObject 

export function isAssetObject(value: any, type?: ImageType, source?: TextSource): value is TextAssetObject 
export function isAssetObject(value: any, type?: ImageType, source?: ColorSource): value is ColorAssetObject 
export function isAssetObject(value: any, type?: ImageType, source?: ShapeSource): value is ShapeAssetObject 

export function isAssetObject(value: any, type?: AssetType, source?: Source): value is AssetObject 
export function isAssetObject(value: any, type: undefined | AssetType = undefined, source: undefined | Source = undefined): value is AssetObject {
  return (
    value && isIdentified(value) 
    && isTyped(value) && isAssetType(value.type) 
    && (!type || type === value.type)
    && 'source' in value && isPopulatedString(value.source)
    && (!source || source === value.source)
  )
}
