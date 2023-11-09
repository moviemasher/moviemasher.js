import type { ColorAsset, ColorInstance, ShapeAsset, ShapeInstance, TextAsset, TextInstance } from '@moviemasher/runtime-shared'
import type { ServerVisibleAsset } from './ServerAssetTypes.js'
import type { ServerVisibleInstance } from './ServerInstanceTypes.js'

export interface ServerTextAsset extends TextAsset, ServerVisibleAsset {}

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

export type ColorTuple = [string, string]

export interface Tweening {
  point?: boolean;
  size?: boolean;
  color?: boolean;
  canColor?: boolean;
}
