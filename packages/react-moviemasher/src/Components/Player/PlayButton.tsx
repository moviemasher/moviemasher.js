import { UnknownObject } from "@moviemasher/moviemasher.js"
import React from "react"
import { View } from "../../Utilities/View"
import { PlayerContext } from "../../Contexts/PlayerContext"

const PlayButton : React.FunctionComponent<UnknownObject> = (props) => {
  const playerContext = React.useContext(PlayerContext)
  const { paused, setPaused } = playerContext

  const handleClick = () => { setPaused(!paused) }

  const pausedOptions = {
    ...props,
    key: 'moviemasher-play',
    onClick: handleClick,
  }
  return <View {...pausedOptions} />
}

export { PlayButton }
