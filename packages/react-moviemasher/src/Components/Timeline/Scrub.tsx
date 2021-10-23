import React from "react"
import { pixelFromFrame, pixelToFrame, UnknownObject } from "@moviemasher/moviemasher.js"
import { View } from "../../Utilities/View"
import { useMashScale } from "./useMashScale"
import { MasherContext } from "../App/MasherContext"

const Scrub: React.FC<UnknownObject> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const masherContext = React.useContext(MasherContext)
  const [down, setDown] = React.useState(() => false)
  const scale = useMashScale()

  const { frames, setFrame } = masherContext
  const width = pixelFromFrame(frames, scale)

  const handleEvent = (event: React.MouseEvent<HTMLDivElement>) => {
    const { current } = ref
    if (!current) return

    const { clientX } = event
    const rect = current.getBoundingClientRect()
    const pixel = Math.max(0, Math.min(rect.width, clientX - rect.x))
    setFrame(pixelToFrame(pixel, scale, 'floor'))
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

  const style: UnknownObject = { width }
  const viewProps: UnknownObject = { ...props, style, onMouseDown, ref }
  if (down) {
    viewProps.onMouseMove = handleMouseMove
    viewProps.onMouseUp = handleMouseUp
    viewProps.onMouseLeave = handleMouseUp
  }
  return <View {...viewProps} />
}

export { Scrub }
