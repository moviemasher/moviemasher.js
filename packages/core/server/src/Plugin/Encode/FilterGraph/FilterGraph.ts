import { MashMedia, Size, Time, CommandFiles, CommandFilters, CommandInputs } from "@moviemasher/lib-core"

export interface FilterGraphArgs {
  visible?: boolean
  background: string
  mash: MashMedia
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
