import { GraphFiles, Size } from "../../../declarations"
import { Times } from "../../../Helpers/Time/Time"
import { AVType, GraphType } from "../../../Setup/Enums"
import { FilterGraph, FilterGraphInstance } from "../FilterGraph/FilterGraph"
import { Mash } from "../Mash"


export interface FilterGraphs {
  duration?: number
  // filterGraphs: FilterGraph[]
  filterGraphAudible: FilterGraph
  filterGraphVisible: FilterGraph
  filterGraphsVisible: FilterGraph[]
  graphFiles: GraphFiles
  graphFilesLoadable: GraphFiles
}

export interface FilterGraphsInstance extends FilterGraphs {
  filterGraphAudible: FilterGraphInstance
}

export interface FilterGraphsArgs {
  times: Times
  preloading: boolean
  avType: AVType
  graphType: GraphType
  size: Size
  videoRate: number
  mash: Mash
}
