import React from "react"
import { pixelFromFrame, UnknownObject } from "@moviemasher/moviemasher.js"
import { MasherContext } from "../App/MasherContext"
import { View } from "../../Utilities/View"
import { useMashScale } from "./useMashScale"

const ScrubButton: React.FC<UnknownObject> = (props) => {
  const masherContext = React.useContext(MasherContext)

  const scale = useMashScale()
  if (!scale) return null

  const { frame } = masherContext


  const left = pixelFromFrame(frame, scale)
  const iconProps = { ...props, key: 'timeline-icon', style: { left } }

  return <View {...iconProps} />
}

export { ScrubButton }
