import React from 'react'
import { EventType } from '@moviemasher/moviemasher.js'

import { PropsAndChildren, ReactResult, WithClassName } from '../../declarations'
import { PlayerContext, PlayerContextInterface } from './PlayerContext'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'
import { useEditor } from '../../Hooks/useEditor'

export interface PlayerProps extends PropsAndChildren, WithClassName {
  disabled?: boolean
}

/**
 * @parents Masher
 * @children PlayerContent, PlayerPlaying, PlayerNotPlaying, PlayerTimeControl, PlayerTime, PlayerButton
 */
export function Player(props: PlayerProps): ReactResult {
  const { disabled, ...rest } = props
  const editor = useEditor()
  const [paused, setPaused] = React.useState(editor.paused)
  const [volume, setVolume] = React.useState(editor.volume)
  const updatePaused = () => { setPaused(editor.paused) }
  useListeners({
    [EventType.Pause]: updatePaused, [EventType.Play]: updatePaused,
    [EventType.Volume]: () => { setVolume(editor.volume) },
  })

  const changePaused = (value: boolean) => { editor.paused = value }
  const changeVolume = (value: number) => { editor.volume = value }

  const playerContext: PlayerContextInterface = {
    paused, disabled, volume, changePaused, changeVolume,
  }
  const contextProps = {
    value: playerContext, children: <View { ...rest } />
  }
  return (
    <PlayerContext.Provider { ...contextProps } />
  )
}
