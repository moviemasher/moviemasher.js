import type { InstanceArgs } from "../Instance/Instance.js";
import type { AudioInstance, AudioInstanceObject } from "./AudioInstance.js";
import { Asset, AssetObject } from '../Asset/Asset.js';

export interface AudioAsset extends Asset {
  instanceFromObject(object?: AudioInstanceObject): AudioInstance;
  instanceArgs(object?: AudioInstanceObject): AudioInstanceObject & InstanceArgs;
}

export interface AudioAssetObject extends AssetObject { }
