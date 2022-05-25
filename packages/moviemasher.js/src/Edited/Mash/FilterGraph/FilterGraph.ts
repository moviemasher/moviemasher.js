import { CommandInputs } from "../../../Api"
import { GraphFile, GraphFiles, GraphFilter, GraphFilters, Size } from "../../../declarations"
import { Evaluator } from "../../../Helpers/Evaluator"
import { Time } from "../../../Helpers/Time/Time"
import { Preloader } from "../../../Preloader/Preloader"
import { AVType, GraphType } from "../../../Setup/Enums"
import { FilterChain, FilterChains } from "../FilterChain/FilterChain"
import { FilterGraphsInstance } from "../FilterGraphs/FilterGraphs"

export interface FilterGraphOptions {
  avType: AVType
  graphType?: GraphType
  preloading?: boolean
  size: Size
  time?: Time
  videoRate: number
}

export interface FilterGraphObject extends Partial<FilterGraphOptions> {}

export interface FilterGraph {
  avType: AVType
  commandInputs: CommandInputs
  duration: number
  graphFiles: GraphFiles
  graphFilters: GraphFilters
  time: Time
}

export interface FilterGraphInstance extends FilterGraph {
  addGraphFile(graphFile: GraphFile): string
  evaluator: Evaluator
  /** the output of my last filterChain */
  graphFilterOutput: string
  graphFilterOutputs(graphFilter: GraphFilter): string[]
  preloading: boolean
  inputGraphFiles: GraphFiles
  loadableGraphFiles: GraphFiles
  preloader: Preloader
  inputCount: number
  duration: number
  time: Time
  filterChains: FilterChains
  filterChainsInitialize(): void
  filterGraphs: FilterGraphsInstance
  graphType: GraphType
  quantize: number
  size: Size
  videoRate: number
}
