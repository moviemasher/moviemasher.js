import React from 'react'
import { BooleanSetter, NumberSetter } from '@moviemasher/moviemasher.js'

export interface PlayerContextInterface {
  paused: boolean,
  setPaused: BooleanSetter
  setVolume: NumberSetter
  volume: number
}

export const PlayerContextDefault: PlayerContextInterface = {
  paused: false,
  setPaused: () => {},
  setVolume: () => {},
  volume: 0,
}

export const PlayerContext = React.createContext(PlayerContextDefault)
