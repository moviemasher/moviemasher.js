import { Size } from "../../../Utility/Size"
import { CommandFilters, CommandFiles } from "../../../MoveMe"
import { Time } from "../../../Helpers/Time/Time"
import { Loader } from "../../../Loader/Loader"
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
  commandFiles: CommandFiles
  commandFilters: CommandFilters
  commandInputs: CommandInputs
  duration: number
  preloader: Loader
  quantize: number
  size: Size
  streaming: boolean
  time: Time
  videoRate: number
  visible: boolean
}
