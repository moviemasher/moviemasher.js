import type { Size, Time, TimeRange } from '@moviemasher/runtime-shared'

import type { Asset } from '../../Shared/Asset/Asset.js'
import type { InstanceObject, VisibleInstance } from '../../Shared/Instance/Instance.js'

export interface ContainerInstance extends VisibleInstance {}
export interface ContainerAsset extends Asset {}

export interface ContainerRectArgs {
  size: Size
  time: Time
  timeRange: TimeRange
  loading?: boolean
  editing?: boolean
}

