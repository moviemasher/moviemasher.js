
import type { 
  GraphFiles, AVType, ServerMashAsset, 
} from "@moviemasher/lib-shared"
import type { FilterGraph } from "../FilterGraph/FilterGraph.js"
import type { Size, Time, Times } from "@moviemasher/runtime-shared"


export interface FilterGraphs {
  duration?: number
  filterGraphAudible?: FilterGraph
  filterGraphVisible: FilterGraph
  filterGraphsVisible: FilterGraph[]
  commandFiles: GraphFiles
  loadCommandFilesPromise: Promise<void>
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
