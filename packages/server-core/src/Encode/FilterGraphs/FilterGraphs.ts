
import { 
  GraphFiles, AVType, GraphType, Size, Time, Mash, Times 
} from "@moviemasher/moviemasher.js"
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
  graphType?: GraphType
  size?: Size
  time?: Time
  videoRate?: number
  background?: string
}

export interface FilterGraphsArgs {
  mash: Mash
  times: Times
  avType: AVType
  graphType: GraphType
  size: Size
  videoRate: number
  background: string
}
