import type { Size, Time } from '@moviemasher/runtime-shared'
import type { CommandFiles, CommandFilters, CommandInputs } from '../../Types/CommandTypes.js'
import type { ServerMashAsset } from '../../Types/ServerMashTypes.js'

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
