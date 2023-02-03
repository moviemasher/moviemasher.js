import { Size } from "../../../Utility/Size"
import { CommandFilters, CommandFiles } from "../../../MoveMe"
import { Time } from "../../../Helpers/Time/Time"
import { CommandInputs } from "../../../Api"
import { Mash } from "../Mash"

export interface FilterGraphArgs {
  visible?: boolean
  background: string
  mash: Mash
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
