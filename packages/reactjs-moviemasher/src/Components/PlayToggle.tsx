import React from "react"
import { UnknownObject } from "@moviemasher/moviemasher.js"
import { AppContext } from "../AppContext"
import { Button } from "../Controls/Button"
import { nodesArray, nodesFind } from "../Utilities/Nodes"

const PlayToggle : React.FC<UnknownObject> = (props) => {
  const { children, ...rest } = props
  const context = React.useContext(AppContext)

  const handleClick = () => { context.setPaused(!context.paused) }

  const kids = nodesArray(children)
  const control = nodesFind(kids, 'moviemasher-play-control')

  const pausedOptions : UnknownObject = {
    key: 'moviemasher-play',
    onClick: handleClick,
    children: nodesFind(kids, `moviemasher-play-${context.paused ? 'false' : 'true'}`),
    ...rest,
  }

  if (control) return React.cloneElement(control, pausedOptions)

  return <Button {...pausedOptions} />
}

export { PlayToggle }
