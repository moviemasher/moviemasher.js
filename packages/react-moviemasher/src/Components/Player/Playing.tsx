import React from 'react'
import { PlayerContext } from './PlayerContext'

const Playing: React.FunctionComponent = props => {
  const playerContext = React.useContext(PlayerContext)
  if (playerContext.paused) return null

  return <>{props.children}</>
}

export { Playing }
