
import { 
  GraphFiles, AVType, Size, Time, MashMedia, Times 
} from "@moviemasher/lib-core"
import { FilterGraph } from "../FilterGraph/FilterGraph"


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
  mash: MashMedia
  times: Times
  avType: AVType
  size: Size
  videoRate: number
  background: string
}
