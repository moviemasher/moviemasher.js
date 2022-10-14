import React from 'react'
import { PlayerContext } from './PlayerContext'
import { PropsAndChild, ReactResult } from '../../declarations'

/**
 *
 * @group Player
 */
export function PlayerNotPlaying(props: PropsAndChild): ReactResult {
  const playerContext = React.useContext(PlayerContext)
  if (!playerContext.paused) return null

  return props.children
}
