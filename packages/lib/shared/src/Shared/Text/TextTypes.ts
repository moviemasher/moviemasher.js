import { Rect } from '@moviemasher/runtime-shared'
import type { Instance, InstanceObject } from '../Instance/Instance.js'
import { RawAsset, RawAssetObject } from '../Raw/RawTypes.js'
import { Filter } from '../../Plugin/Filter/Filter.js'

export interface TextAsset extends RawAsset {
  family: string
  string: string
}

export interface TextInstance extends Instance {
  asset: TextAsset
  string: string
  textFilter: Filter  
  intrinsic?: Rect
}

export interface TextInstanceObject extends InstanceObject {
  intrinsic?: Rect
  string?: string
}

export interface TextAssetObject extends RawAssetObject {
  string?: string
}
