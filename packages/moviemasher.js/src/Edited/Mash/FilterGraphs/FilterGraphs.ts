import { Size } from "../../../Utility/Size"
import { GraphFiles } from "../../../MoveMe"
import { Time, Times } from "../../../Helpers/Time/Time"
import { AVType, GraphType } from "../../../Setup/Enums"
import { FilterGraph } from "../FilterGraph/FilterGraph"
import { Mash } from "../Mash"


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
