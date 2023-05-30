import type { InstanceArgs } from '../Instance/Instance.js';
import type { VideoInstance, VideoInstanceObject } from './VideoInstance.js';
import { Asset, AssetObject, VisibleAssetObject } from '../Asset/Asset.js';

export interface VideoAsset extends Asset {
  instanceFromObject(object?: VideoInstanceObject): VideoInstance;
  instanceArgs(object?: VideoInstanceObject): VideoInstanceObject & InstanceArgs;
}

export interface VideoAssetObject extends AssetObject, VisibleAssetObject { }
