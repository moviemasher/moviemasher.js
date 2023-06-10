import type { ServerMashAsset, CommandFiles, CommandFilters, CommandInputs } from "@moviemasher/lib-shared"
import type { Size, Time } from "@moviemasher/runtime-shared"

export interface FilterGraphArgs {
  visible?: boolean
  background: string
  mash: ServerMashAsset
  size: Size
  streaming?: boolean
  time: Time
  videoRate: number
}

export interface FilterGraph {
  background: string
  filterGraphCommandFiles: CommandFiles
  commandFilters: CommandFilters
  commandInputs: CommandInputs
  duration: number
  quantize: number
  size: Size
  streaming: boolean
  time: Time
  videoRate: number
  visible: boolean
}
