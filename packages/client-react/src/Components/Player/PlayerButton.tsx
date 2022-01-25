import React from "react"
import { View } from "../../Utilities/View"
import { PlayerContext } from "../../Contexts/PlayerContext"
import { PropsWithChildren, ReactResult } from "../../declarations"

/**
 *
 * @parents Player
 */
function PlayerButton(props: PropsWithChildren): ReactResult {
  const playerContext = React.useContext(PlayerContext)
  const { paused, setPaused } = playerContext

  const handleClick = () => { setPaused(!paused) }

  const viewProps = {
    ...props,
    key: 'player-button',
    onClick: handleClick,
  }
  return <View {...viewProps} />
}

export { PlayerButton }