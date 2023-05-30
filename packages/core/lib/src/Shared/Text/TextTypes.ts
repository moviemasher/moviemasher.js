import { Rect } from '@moviemasher/runtime-shared'
import type { Instance, InstanceObject } from '../Instance/Instance.js'
import { ImportedAsset, ImportedAssetObject } from '../Imported/ImportedTypes.js'
import { Filter } from '../../Plugin/Filter/Filter.js'

export interface TextAsset extends ImportedAsset {
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
}

export interface TextAssetObject extends ImportedAssetObject {
  string?: string
}
