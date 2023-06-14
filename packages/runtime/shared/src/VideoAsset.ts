import type { Asset, AssetObject, VisibleAssetObject } from './AssetTypes.js'
import type { InstanceArgs } from './Instance.js'
import type { VideoInstanceObject, VideoInstance } from './VideoInstance.js'

export interface VideoAsset extends Asset {
  instanceFromObject(object?: VideoInstanceObject): VideoInstance
  instanceArgs(object?: VideoInstanceObject): VideoInstanceObject & InstanceArgs
}

export interface VideoAssetObject extends AssetObject, VisibleAssetObject { }
