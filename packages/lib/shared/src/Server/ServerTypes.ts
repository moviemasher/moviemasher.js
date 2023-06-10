import type { ColorAsset, ColorInstance } from '../Shared/Color/ColorTypes.js'
import type { ShapeAsset, ShapeInstance } from '../Shared/Shape/ShapeTypes.js'
import type { TextAsset, TextInstance } from '../Shared/Text/TextTypes.js'
import type { ServerVisibleAsset } from './Asset/ServerAsset.js'
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
