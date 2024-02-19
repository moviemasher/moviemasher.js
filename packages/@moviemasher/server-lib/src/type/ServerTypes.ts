import type { AudioInstance, ColorAsset, ColorInstance, ImageInstance, Instance, RawAsset, RawAssetObject, RawAudioAssetObject, RawImageAssetObject, RawVideoAssetObject, ShapeAsset, ShapeInstance, TextAsset, TextAssetObject, TextInstance, VideoInstance, ArrayOf2, Value } from '@moviemasher/shared-lib/types.js'
import type { ServerAudioAsset, ServerImageAsset, ServerVideoAsset, ServerVisibleAsset } from './ServerAssetTypes.js'
import type { ServerInstance, ServerVisibleInstance } from '../types.js'
import type { ServerAsset } from '../types.js'

export interface ServerTextAsset extends TextAsset, ServerVisibleAsset {
  assetObject: TextAssetObject
}

export interface ServerTextInstance extends TextInstance, ServerVisibleInstance {
  asset: ServerTextAsset
}

export interface ServerColorAsset extends ColorAsset, ServerVisibleAsset {  }

export interface ServerColorInstance extends ColorInstance, ServerVisibleInstance {
  asset: ServerColorAsset
}

export interface ServerShapeAsset extends ShapeAsset, ServerVisibleAsset {}

export interface ServerShapeInstance extends ShapeInstance, ServerVisibleInstance {
  asset: ServerShapeAsset
}

export interface Tweening {
  point?: boolean;
  size?: boolean;
  color?: boolean;
  canColor?: boolean;
}

export interface ServerRawAsset extends RawAsset, ServerAsset {
  assetObject: RawAssetObject
}

export interface ServerRawAudioAsset extends ServerRawAsset, ServerAudioAsset {
  assetObject: RawAudioAssetObject
}

export interface ServerRawImageAsset extends ServerRawAsset, ServerImageAsset {
  assetObject: RawImageAssetObject
}

export interface ServerRawVideoAsset extends ServerRawAsset, ServerVideoAsset {
  assetObject: RawVideoAssetObject
}

export interface ServerRawInstance extends Instance, ServerInstance {
  asset: ServerRawAsset
}

export interface ServerRawAudioInstance extends AudioInstance, ServerInstance {
  asset: ServerRawAudioAsset
}

export interface ServerRawImageInstance extends ImageInstance, ServerInstance {
  asset: ServerRawImageAsset
}

export interface ServerRawVideoInstance extends VideoInstance, ServerInstance {
  asset: ServerRawVideoAsset
}

export interface ValueTuple extends ArrayOf2<Value> {}

export interface NumberTuple extends ArrayOf2<number> {}