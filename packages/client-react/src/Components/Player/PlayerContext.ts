import React from 'react'
import { BooleanSetter, EmptyMethod, NumberSetter } from '@moviemasher/moviemasher.js'

export interface PlayerContextInterface {
  disabled?: boolean
  paused: boolean,
  changePaused: BooleanSetter
  changeVolume: NumberSetter
  volume: number
}

export const PlayerContextDefault: PlayerContextInterface = {
  paused: false,
  changePaused: EmptyMethod,
  changeVolume: EmptyMethod,
  volume: 0,
}

export const PlayerContext = React.createContext(PlayerContextDefault)
