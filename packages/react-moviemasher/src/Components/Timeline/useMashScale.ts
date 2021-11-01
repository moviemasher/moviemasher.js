import React from "react"
import { pixelPerFrame } from '@moviemasher/moviemasher.js'
import { EditorContext } from "../Editor/EditorContext"
import { TimelineContext } from "./TimelineContext"

const useMashScale = () => {
  const timelineContext = React.useContext(TimelineContext)
  const editorContext = React.useContext(EditorContext)
  const { width, zoom } = timelineContext
  if (!width) return 0

  const { frames } = editorContext
  return pixelPerFrame(frames, width, zoom)
}

export { useMashScale }
