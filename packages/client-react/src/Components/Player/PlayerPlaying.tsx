import React from 'react'

import { PlayerContext } from '../../Contexts/PlayerContext'
import { PropsAndChild, ReactResult } from '../../declarations'

/**
 *
 * @group Player
 */
export function PlayerPlaying(props: PropsAndChild): ReactResult {
  const playerContext = React.useContext(PlayerContext)
  if (playerContext.paused) return null

  return props.children
}
