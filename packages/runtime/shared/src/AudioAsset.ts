import type { Asset, AssetObject } from './AssetInterfaces.js'
import type { AudioInstanceObject, AudioInstance } from './AudioInstance.js'
import type { InstanceArgs } from './InstanceTypes.js'

export interface AudioAsset extends Asset {
  instanceFromObject(object?: AudioInstanceObject): AudioInstance
  instanceArgs(object?: AudioInstanceObject): AudioInstanceObject & InstanceArgs
}

export interface AudioAssetObject extends AssetObject { }
