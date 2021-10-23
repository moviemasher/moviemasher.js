import React from "react"
import { UnknownObject } from "@moviemasher/moviemasher.js"
import { nodesArray, nodesFind } from "../../Deprecated/Nodes"
import { MMContext } from "../App/MMContext"
import { Button } from "../../Utilities/Button"

const PlayToggle : React.FC<UnknownObject> = (props) => {
  const appContext = React.useContext(MMContext)
  const { paused, setPaused } = appContext
  const { children, ...rest } = props

  const handleClick = () => { setPaused(!paused) }

  const kids = nodesArray(children)

  const control = nodesFind(kids, 'moviemasher-play-control')

  const pausedOptions : UnknownObject = {
    key: 'moviemasher-play',
    onClick: handleClick,
    children: nodesFind(kids, `moviemasher-play-${paused ? 'false' : 'true'}`),
    ...rest,
  }

  if (control) return React.cloneElement(control, pausedOptions)

  return <Button {...pausedOptions} />
}

export { PlayToggle }
