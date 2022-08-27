import React from "react"
import { View } from "../../Utilities/View"
import { PlayerContext } from "./PlayerContext"
import { PropsWithChildren, ReactResult } from "../../declarations"

/**
 *
 * @parents Player
 */
export function PlayerButton(props: PropsWithChildren): ReactResult {
  const playerContext = React.useContext(PlayerContext)
  const { paused, changePaused: setPaused } = playerContext

  const onClick = () => { setPaused(!paused) }

  const viewProps = {
    ...props, key: 'player-button', onClick,
  }
  return <View {...viewProps} />
}
