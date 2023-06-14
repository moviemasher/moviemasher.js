import type { ColorAsset, ColorInstance } from '@moviemasher/runtime-shared'
import type { ShapeAsset, ShapeInstance } from '@moviemasher/runtime-shared'
import type { TextAsset, TextInstance } from '@moviemasher/runtime-shared'
import type { ServerVisibleAsset } from './Asset/ServerAssetTypes.js'
import type { ServerVisibleInstance } from './ServerInstance.js'

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
