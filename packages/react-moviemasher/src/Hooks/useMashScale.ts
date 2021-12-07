import React from "react"
import { EventType, pixelPerFrame } from '@moviemasher/moviemasher.js'
import { TimelineContext } from "../Contexts/TimelineContext"
import { useListeners } from "./useListeners"

const useMashScale = () => {
  const timelineContext = React.useContext(TimelineContext)
  const { masher } = useListeners({
    [EventType.Duration]: masher => { setFrames(masher.mash.frames) }
  })

  const [frames, setFrames] = React.useState(masher.mash.frames)
  const { width, zoom } = timelineContext
  if (!width) return 0

  return pixelPerFrame(frames, width, zoom)
}

export { useMashScale }
