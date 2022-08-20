import React from 'react'
import { EventType } from '@moviemasher/moviemasher.js'
import { ListenerCallback, PropsAndChildren, ReactResult, WithClassName } from '../../declarations'

import { PlayerContext, PlayerContextInterface } from './PlayerContext'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'
import { useEditor } from '../../Hooks/useEditor'

export interface PlayerProps extends PropsAndChildren, WithClassName {}

/**
 * @parents Masher
 * @children PlayerContent, PlayerPlaying, PlayerNotPlaying, PlayerTimeControl, PlayerButton
 */
export function Player(props: PlayerProps): ReactResult {
  const editor = useEditor()
  const handlePaused : ListenerCallback = () => { setPaused(editor.paused) }
  useListeners({
    [EventType.Pause]: handlePaused,
    [EventType.Play]: handlePaused,
    [EventType.Volume]: () => { setVolume(editor.volume) },
  })

  const [paused, setPaused] = React.useState(editor.paused)
  const [volume, setVolume] = React.useState(editor.volume)

  const changePaused = (value: boolean) => { editor.paused = value }
  const changeVolume = (value: number) => { editor.volume = value }

  const onDrop = (event: DragEvent) => {
    
  }
  const playerContext: PlayerContextInterface = {
    paused,
    setPaused: changePaused,
    setVolume: changeVolume,
    volume, onDrop,
  }

  const viewProps = { ...props, onDrop }
  return (
    <PlayerContext.Provider value={playerContext}>
      <View { ...viewProps } />
    </PlayerContext.Provider>
  )
}
