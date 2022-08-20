import React from 'react'
import { BooleanSetter, EmptyMethod, NumberSetter } from '@moviemasher/moviemasher.js'

export interface PlayerContextInterface {
  paused: boolean,
  setPaused: BooleanSetter
  setVolume: NumberSetter
  volume: number
  onDrop: (event: DragEvent) => void
}

export const PlayerContextDefault: PlayerContextInterface = {
  paused: false,
  setPaused: EmptyMethod,
  setVolume: EmptyMethod,
  volume: 0,
  onDrop: EmptyMethod,
}

export const PlayerContext = React.createContext(PlayerContextDefault)
