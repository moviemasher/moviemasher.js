import React from 'react'

import { PlayerContext } from './PlayerContext'

import { PropsAndChild } from "../../Types/Props"

/**
 *
 * @group Player
 */
export function PlayerPlaying(props: PropsAndChild) {
  const playerContext = React.useContext(PlayerContext)
  if (playerContext.paused) return null

  return props.children
}
