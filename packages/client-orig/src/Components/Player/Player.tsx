import React from 'react'
import { EventTypePause, EventTypePlay, EventTypeVolume } from '@moviemasher/lib-core'


import { PropsWithChildren } from "../../Types/Props"
import { PlayerContext, PlayerContextInterface } from './PlayerContext'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'
import { useMasher } from '../../Hooks/useMasher'

export interface PlayerProps extends PropsWithChildren {
  disabled?: boolean
}

export function Player(props: PlayerProps) {
  const { disabled, ...rest } = props
  const editor = useMasher()
  const [paused, setPaused] = React.useState(editor.paused)
  const [volume, setVolume] = React.useState(editor.volume)
  const updatePaused = () => { setPaused(editor.paused) }
  useListeners({
    [EventTypePause]: updatePaused, [EventTypePlay]: updatePaused,
    [EventTypeVolume]: () => { setVolume(editor.volume) },
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
