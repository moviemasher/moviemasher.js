import { Dimensions } from "../../../Setup/Dimensions"
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
  graphFiles: GraphFiles
}

export interface FilterGraphsOptions {
  avType?: AVType
  graphType?: GraphType
  size?: Dimensions
  time?: Time
  videoRate?: number
  backcolor?: string
}

export interface FilterGraphsArgs {
  mash: Mash
  times: Times
  avType: AVType
  graphType: GraphType
  size: Dimensions
  videoRate: number
  backcolor: string
}
