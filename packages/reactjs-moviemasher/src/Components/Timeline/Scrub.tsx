import React from "react"
import { pixelFromFrame, pixelPerFrame, pixelToFrame, UnknownObject } from "@moviemasher/moviemasher.js"
import { AppContext } from "../../AppContext"
import { View } from "../../View"
import { TimelineContext } from "./TimelineContext"
import { ScrubButton } from "./ScrubButton"


interface ScrubComposition {
  Button: typeof ScrubButton
}

const Scrub: React.FC<UnknownObject> & ScrubComposition = (props) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const appContext = React.useContext(AppContext)
  const timelineContext = React.useContext(TimelineContext)
  const [down, setDown] = React.useState(() => false)
  const { timeRange, quantize } = appContext
  const { width, zoom } = timelineContext
  const mashTimeRange = timeRange.scale(quantize)
  const perFrame = pixelPerFrame(mashTimeRange.frames, width, zoom)

  const handleEvent = (event: React.MouseEvent<HTMLDivElement>) => {
    const { current } = ref
    if (!current) return

    const { clientX } = event
    const rect = current.getBoundingClientRect()

    // constrain to component width
    const pixel = Math.max(0, Math.min(rect.width, clientX - rect.x))

    const frame = pixelToFrame(pixel, perFrame, 'floor')
    appContext.setTime(mashTimeRange.withFrame(frame))
  }
  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setDown(true)
    handleEvent(event)
  }
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    handleEvent(event)
  }
  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    setDown(false)
    handleEvent(event)
  }
  const pixel = pixelFromFrame(mashTimeRange.frames, perFrame)
  const style: UnknownObject = { width: pixel }

  const viewProps: UnknownObject = { ...props, style, onMouseDown, ref }
  if (down) {
    viewProps.onMouseMove = handleMouseMove
    viewProps.onMouseUp = handleMouseUp
    viewProps.onMouseLeave = handleMouseUp
  }

  return <View {...viewProps} />
}

Scrub.Button = ScrubButton

export { Scrub }
