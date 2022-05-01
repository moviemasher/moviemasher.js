import React from "react"
import { EventType, pixelPerFrame } from '@moviemasher/moviemasher.js'
import { TimelineContext } from "../Contexts/TimelineContext"
import { useListeners } from "./useListeners"
import { useMashEditor } from "./useMashEditor"

export const useMashScale = () => {
  const timelineContext = React.useContext(TimelineContext)
  const masher = useMashEditor()
  const [frames, setFrames] = React.useState(masher.mash.frames)
  useListeners({
    [EventType.Duration]: () => { setFrames(masher.mash.frames) }
  })
  const { width, zoom } = timelineContext
  if (!width) return 0

  return pixelPerFrame(frames, width, zoom)
}
