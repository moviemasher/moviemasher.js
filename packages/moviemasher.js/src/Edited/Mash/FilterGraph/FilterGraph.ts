import { Dimensions } from "../../../Setup/Dimensions"
import { CommandFilters, CommandFiles } from "../../../MoveMe"
import { Time } from "../../../Helpers/Time/Time"
import { Loader } from "../../../Loader/Loader"
import { CommandInputs } from "../../../Api"
import { Mash } from "../Mash"

export interface FilterGraphArgs {
  visible?: boolean
  backcolor: string
  mash: Mash
  size: Dimensions
  streaming?: boolean
  time: Time
  videoRate: number
}

export interface FilterGraph {
  backcolor: string
  commandFiles: CommandFiles
  commandFilters: CommandFilters
  commandInputs: CommandInputs
  duration: number
  preloader: Loader
  quantize: number
  size: Dimensions
  streaming: boolean
  time: Time
  videoRate: number
  visible: boolean
}
