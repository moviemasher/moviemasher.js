import { Dimensions } from "../../../Setup/Dimensions"
import { GraphFiles, CommandFilters } from "../../../MoveMe"
import { Time } from "../../../Helpers/Time/Time"
import { Loader } from "../../../Loader/Loader"
import { CommandInputs } from "../../../Api"
import { FilterChains } from "../FilterChain/FilterChain"
import { Mash } from "../Mash"

export interface FilterGraphArgs {
  streaming?: boolean
  size: Dimensions
  time: Time
  videoRate: number
  backcolor: string
  mash: Mash
}

export interface FilterGraph {
  // addGraphFile(graphFile: GraphFile): string
  audible: boolean
  backcolor: string
  commandFilters: CommandFilters
  commandInputs: CommandInputs
  duration: number
  editing: boolean
  filterChains: FilterChains
  // filterChainsInitialize(): void
  // graphFileId(localId: string): string
  graphFiles: GraphFiles
  // graphFilesById: Map <string, GraphFile>
  // graphFilterOutputs(graphFilter: GraphFilter): string[]
  // inputCount: number
  // inputGraphFiles: GraphFiles
  // inputIdsByGraphFileId: Map<string, string>
  // loadableGraphFiles: GraphFiles
  preloader: Loader
  quantize: number
  size: Dimensions
  streaming: boolean
  time: Time
  videoRate: number
  visible: boolean
}
