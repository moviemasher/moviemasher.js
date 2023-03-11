import { BooleanSetter, EmptyFunction, NumberSetter } from '@moviemasher/moviemasher.js'
import { createContext } from '../../Framework/FrameworkFunctions'

export interface PlayerContextInterface {
  disabled?: boolean
  paused: boolean,
  changePaused: BooleanSetter
  changeVolume: NumberSetter
  volume: number
}

export const PlayerContextDefault: PlayerContextInterface = {
  paused: false,
  changePaused: EmptyFunction,
  changeVolume: EmptyFunction,
  volume: 0,
}

export const PlayerContext = createContext(PlayerContextDefault)
