import React from "react"
import { pixelPerFrame } from '@moviemasher/moviemasher.js'

import { AppContext } from "../../AppContext"
import { TimelineContext } from "./TimelineContext"

const usePerFrame = () => {
  const appContext = React.useContext(AppContext)
  const timelineContext = React.useContext(TimelineContext)

  const { width, zoom } = timelineContext
  const { timeRange, quantize } = appContext
  const calculatePerFrame = () => {
    if (!width) return 0

    const mashTimeRange = timeRange.scale(quantize)
    return pixelPerFrame(mashTimeRange.frames, width, zoom)
  }
  return calculatePerFrame()
  // const perFrame = React.useMemo(calculatePerFrame, [width, zoom, timeRange, quantize])

  // return perFrame
}

export { usePerFrame }
