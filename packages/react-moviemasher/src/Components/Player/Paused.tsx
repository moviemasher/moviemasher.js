import React from 'react'
import { PlayerContext } from './PlayerContext'

const Paused: React.FunctionComponent = props => {
  const playerContext = React.useContext(PlayerContext)
  if (!playerContext.paused) return null

  return <>{props.children}</>
}

export { Paused }
