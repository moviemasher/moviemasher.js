import React from 'react'

import { PlayerContext } from '../../Contexts/PlayerContext'
import { PropsAndChild, ReactResult } from '../../declarations'

/**
 *
 * @group Player
 */
function Playing(props: PropsAndChild): ReactResult {
  const playerContext = React.useContext(PlayerContext)
  if (playerContext.paused) return null

  return props.children
}

export { Playing }
