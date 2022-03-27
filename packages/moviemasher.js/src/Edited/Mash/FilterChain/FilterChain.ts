import {
  GraphFile, GraphFilter, GraphFilters, ModularGraphFilter
} from "../../../declarations"
import { VisibleContext } from "../../../Context/VisibleContext"
import { FilterGraphInstance } from "../FilterGraph/FilterGraph"


export interface FilterChain {
  filterGraph: FilterGraphInstance
  graphFilters: GraphFilters
  graphFilter?: GraphFilter
  visibleContext: VisibleContext
  uniqueFilter(filter: string): string
  addModularGraphFilter(modularGraphFilter: ModularGraphFilter): void
  addGraphFilter(graphFilter: GraphFilter): void
  addGraphFile(graphFile: GraphFile): string
}

export type FilterChains = FilterChain[]
