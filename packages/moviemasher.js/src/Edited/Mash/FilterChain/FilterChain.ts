import { GraphFile, GraphFilter, GraphFilters, GraphFiles, ChainBuilder, CommandFilters } from "../../../MoveMe"
import { FilterGraph } from "../FilterGraph/FilterGraph"
import { Clip } from "../../../Mixin/Clip/Clip"
import { Time, TimeRange } from "../../../Helpers/Time/Time"
import { FilterChainPhases } from "../../../Filter/Filter"

export interface FilterChainArgs {
  tweenTime?: Time,
  graphFilter?: GraphFilter
  clip: Clip
  filterGraph: FilterGraph
  timeRange: TimeRange
  input: string
  track: number
  lastTrack: boolean
}

export interface FilterChain extends ChainBuilder {
  args: FilterChainArgs
  filterGraph: FilterGraph

  commandFilters: CommandFilters
  // input: string
  // graphFile(id: string): GraphFile
  graphFiles: GraphFiles
  // graphFilters: GraphFilters
  // inputId(id: string): string
  // uniqueFilter(filter: string): string
  clip: Clip
  filterChainPhases: FilterChainPhases
}

export type FilterChains = FilterChain[]
