import React from 'react'
import { EventType } from '@moviemasher/moviemasher.js'
import { ListenerCallback, PropsAndChildren, ReactResult } from '../../declarations'

import { PlayerContext, PlayerContextInterface } from '../../Contexts/PlayerContext'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'
import { useMashEditor } from '../../Hooks/useMashEditor'


/**
 * @parents Masher, Streamer
 * @children PlayerContent, Playing, PlayerNotPlaying, TimeSlider, PlayerButton
 */
function Player(props: PropsAndChildren): ReactResult {
  const masher = useMashEditor()
  const handlePaused : ListenerCallback = () => { setPaused(masher.paused) }
  useListeners({
    [EventType.Pause]: handlePaused,
    [EventType.Play]: handlePaused,
    [EventType.Volume]: () => { setVolume(masher.volume) },
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
      <View {...props}/>
    </PlayerContext.Provider>
  )
}

export { Player }
