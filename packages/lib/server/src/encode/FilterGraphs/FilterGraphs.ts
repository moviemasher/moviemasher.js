import type { GraphFiles } from '@moviemasher/runtime-server'
import type { AVType, DataOrError, Size, Time, Times } from '@moviemasher/runtime-shared'
import type { ServerMashAsset } from '../../Types/ServerMashTypes.js'
import type { FilterGraph } from '../FilterGraph/FilterGraph.js'

export interface FilterGraphs {
  duration?: number
  filterGraphAudible?: FilterGraph
  filterGraphVisible: FilterGraph
  filterGraphsVisible: FilterGraph[]
  commandFiles: GraphFiles
  loadCommandFilesPromise: Promise<DataOrError<number>>
}

export interface FilterGraphsOptions {
  avType?: AVType
  size?: Size
  time?: Time
  videoRate?: number
  background?: string
}

export interface FilterGraphsArgs {
  mash: ServerMashAsset
  times: Times
  avType: AVType
  size: Size
  videoRate: number
  background: string
}
