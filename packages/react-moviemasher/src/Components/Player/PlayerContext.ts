import React from 'react'
import { BooleanSetter, NumberSetter } from '@moviemasher/moviemasher.js'

interface PlayerContextInterface {
  paused: boolean,
  setPaused: BooleanSetter
  setVolume: NumberSetter
  volume: number
}
const PlayerContextDefault: PlayerContextInterface = {
  paused: false,
  setPaused: () => {},
  setVolume: () => {},
  volume: 0,
}

const PlayerContext = React.createContext(PlayerContextDefault)

export { PlayerContext, PlayerContextInterface, PlayerContextDefault }
