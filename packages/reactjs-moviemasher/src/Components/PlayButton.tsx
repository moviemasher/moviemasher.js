import React, { FC, ReactElement, useContext } from "react"
import { UnknownObject } from "@moviemasher/moviemasher.js"
import { AppContext } from "../AppContext"

interface PlayButtonProps extends UnknownObject {
  play: ReactElement
  pause: ReactElement
  control: ReactElement
}

const PlayButton : FC<PlayButtonProps> = (props) => {
  const context = useContext(AppContext)
  const handleChangePaused = () => { context.setPaused(!context.paused) }

  const { play, pause, control, ...rest } = props
  const pausedOptions = {
    key: 'play-button',
    className: 'moviemasher-paused moviemasher-button',
    onClick: handleChangePaused,
    children: context.paused ? play : pause,
    ...rest,
  }
  return React.cloneElement(control, pausedOptions)
}

export { PlayButton, PlayButtonProps }
