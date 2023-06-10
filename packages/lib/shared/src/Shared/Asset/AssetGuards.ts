import type { Asset, SourceAsset, AssetObject } from './AssetTypes.js'

import { AssetType, AudioType, ColorSource, ImageType, MashSource, RawSource, ShapeSource, SourceText, TextSource, TypeImage, VideoType, isAssetType, PromptSource, Source, TypeVideo, SourceRaw, TypeAudio } from '@moviemasher/runtime-shared'

import { assertIdentified, isIdentified } from '../../Base/IdentifiedGuards.js'
import { assertTyped, isTyped } from '../../Base/TypedGuards.js'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { isPopulatedString } from '../SharedGuards.js'
import { assertAssetType } from './AssetTypeGuards.js'
import { ImageAssetObject } from '../Image/ImageAsset.js'
import { AudioAssetObject } from '../Audio/AudioAsset.js'
import { VideoAssetObject } from '../Video/VideoAsset.js'
import { RawAudioAssetObject, RawImageAssetObject, RawVideoAssetObject } from '../Raw/RawTypes.js'
import { TextAssetObject } from '../Text/TextTypes.js'
import { MashAudioAssetObject, MashImageAssetObject, MashVideoAssetObject } from '../Mash/MashTypes.js'
import { ColorAssetObject } from '../Color/ColorTypes.js'
import { ShapeAssetObject } from '../Shape/ShapeTypes.js'
import { PromptAudioAssetObject, PromptImageAssetObject, PromptVideoAssetObject } from '../Prompt/PromptTypes.js'

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
    isIdentified(value) 
    && isTyped(value) && isAssetType(value.type) 
    && 'source' in value && isPopulatedString(value.source)
    && (!type || type === value.type )
    && (!source || source === value.source)
  )
}

const assetObject = {}
if (isAssetObject(assetObject)) assetObject.type

const imageAssetObject = {}
if (isAssetObject(imageAssetObject, TypeImage)) imageAssetObject.type


const textAssetObject = {}
if (isAssetObject(textAssetObject, TypeImage, SourceText)) textAssetObject.type


const videoAssetObject = {}
if (isAssetObject(videoAssetObject, TypeVideo)) videoAssetObject.type

const rawAudioAssetObject = {}
if (isAssetObject(rawAudioAssetObject, TypeAudio, SourceRaw)) rawAudioAssetObject.type
