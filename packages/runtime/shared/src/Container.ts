import type { Asset } from './AssetTypes.js'
import type { VisibleInstance } from './Instance.js'
import type { Size } from './Size.js'
import type { Time, TimeRange } from './Time.js'

export interface ContainerInstance extends VisibleInstance {}

export interface ContainerAsset extends Asset {}

export interface ContainerRectArgs {
  size: Size
  time: Time
  timeRange: TimeRange
  loading?: boolean
  editing?: boolean
}
