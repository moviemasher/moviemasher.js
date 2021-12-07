import React from 'react'
import { PlayerContext } from '../../Contexts/PlayerContext'

const NotPlaying: React.FunctionComponent = props => {
  const playerContext = React.useContext(PlayerContext)
  if (!playerContext.paused) return null

  return <>{props.children}</>
}

export { NotPlaying }
