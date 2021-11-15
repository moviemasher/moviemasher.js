import React from 'react'
import { EventType } from '@moviemasher/moviemasher.js'
import { ListenerCallback, Panel } from '../../declarations'

import { PlayerContext, PlayerContextInterface } from './PlayerContext'
import { useListeners } from '../../Hooks/useListeners'

const PlayerPanel: Panel = props => {
  const handlePaused : ListenerCallback = (masher) => { setPaused(masher.paused) }
  const { masher } = useListeners({
    [EventType.Pause]: handlePaused,
    [EventType.Play]: handlePaused,
    [EventType.Volume]: masher => { setVolume(masher.volume) },
  })

  const [paused, setPaused] = React.useState(masher.paused)
  const [volume, setVolume] = React.useState(masher.volume)

  const changePaused = (value: boolean) => { masher.paused = value }
  const changeVolume = (value: number) => { masher.volume = value }

  const playerContext: PlayerContextInterface = {
    paused,
    setPaused: changePaused,
    setVolume: changeVolume,
    volume,
  }

  return (
    <PlayerContext.Provider value={playerContext}>
      <div {...props}/>
    </PlayerContext.Provider>
  )
}

export { PlayerPanel }
