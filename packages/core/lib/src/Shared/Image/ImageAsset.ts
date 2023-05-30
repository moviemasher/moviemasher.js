import type { InstanceArgs } from "../Instance/Instance.js";
import type { ImageInstance, ImageInstanceObject } from "./ImageInstance.js";
import { Asset, AssetObject } from '../Asset/Asset.js';




export interface ImageAsset extends Asset {
  instanceFromObject(object?: ImageInstanceObject): ImageInstance;
  instanceArgs(object?: ImageInstanceObject): ImageInstanceObject & InstanceArgs;
}

export interface ImageAssetObject extends AssetObject { }
