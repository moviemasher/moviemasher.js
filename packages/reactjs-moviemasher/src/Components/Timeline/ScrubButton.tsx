import React from "react"
import { pixelFromFrame, pixelPerFrame, UnknownObject } from "@moviemasher/moviemasher.js"
import { AppContext } from "../../AppContext"
import { View } from "../../View"
import { TimelineContext } from "./TimelineContext"

const ScrubButton: React.FC<UnknownObject> = (props) => {
  // const reference = React.useRef<HTMLElement>(null)
  const appContext = React.useContext(AppContext)
  const timelineContext = React.useContext(TimelineContext)

  const iconStyle : UnknownObject = {}
  const iconProps = { ...props, key: 'timeline-icon', style: iconStyle }

  const { width, zoom } = timelineContext

  if (width) {
    const { timeRange, quantize } = appContext
    const mashTimeRange = timeRange.scale(quantize)
    const perFrame = pixelPerFrame(mashTimeRange.frames, width, zoom)
    const pixel = pixelFromFrame(mashTimeRange.frame, perFrame)
    const left = pixel;
    iconStyle.left = `${left}px`
  }
  return <View {...iconProps} />
}

export { ScrubButton }
