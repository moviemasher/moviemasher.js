// import React from "react"
// import { pixelPerFrame } from '@moviemasher/moviemasher.js'
// import { MMContext } from "../../MMContext"
// import { TimelineContext } from "./TimelineContext"

// const useMashScale = () => {
//   const timelineContext = React.useContext(TimelineContext)
//   const appContext = React.useContext(MMContext)
//   const { width, zoom } = timelineContext
//   if (!width) return 0

//   const { frames } = appContext.masher.mash
//   return pixelPerFrame(frames, width, zoom)
// }

// export { useMashScale }


import React from "react"
import { pixelPerFrame } from '@moviemasher/moviemasher.js'
import { MasherContext } from "../App/MasherContext"
// import { MMContext } from "../../MMContext"

import { TimelineContext } from "./TimelineContext"

const useMashScale = () => {
  const timelineContext = React.useContext(TimelineContext)
  // const appContext = React.useContext(MMContext)
  const masherContext = React.useContext(MasherContext)
  const { width, zoom } = timelineContext
  if (!width) return 0

  const { frames } = masherContext
  // const { quantize, masher } = appContext
  // const { fps } = masher
  // const time = Time.fromArgs(frames, fps)
  // const scaled = time.scale(quantize)
  return pixelPerFrame(frames, width, zoom)
}

export { useMashScale }
