import type { Instance, InstanceObject } from './Instance.js'
import type { RawAsset, RawAssetObject } from './RawTypes.js'
import type { Rect } from './Rect.js'

export interface TextAsset extends RawAsset {
  family: string
  string: string
}

export interface TextInstance extends Instance {
  asset: TextAsset
  string: string
  intrinsic?: Rect
}

export interface TextInstanceObject extends InstanceObject {
  intrinsic?: Rect
  string?: string
}

export interface TextAssetObject extends RawAssetObject {
  string?: string
}
