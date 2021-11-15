import React from "react"
import { EventType, pixelFromFrame, pixelToFrame, Time, UnknownObject } from "@moviemasher/moviemasher.js"

import { View } from "../../Utilities/View"
import { useMashScale } from "./useMashScale"
import { useListeners } from "../../Hooks/useListeners"

const Scrubber: React.FC<UnknownObject> = (props) => {
  const { masher } = useListeners({
    [EventType.Duration]: masher => { setFrames(masher.mash.frames)}
  })
  const [frames, setFrames] = React.useState(masher.mash.frames)
  const clientXRef = React.useRef<number>(-1)

  const ref = React.useRef<HTMLDivElement>(null)

  const [down, setDown] = React.useState(() => false)
  const scale = useMashScale()

  const handleEvent = (event: React.MouseEvent<HTMLDivElement>) => {
    const { current } = ref
    if (!current) return

    const { clientX } = event
    if (clientXRef.current === clientX) return

    clientXRef.current = clientX

    const rect = current.getBoundingClientRect()
    const pixel = Math.max(0, Math.min(rect.width, clientX - rect.x))
    const frame = pixelToFrame(pixel, scale, 'floor')
    masher.time = Time.fromArgs(frame, masher.mash.quantize)
  }

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    clientXRef.current = -1
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

  const style: UnknownObject = {}
  const width = pixelFromFrame(frames, scale, 'ceil')
  if (width) style.minWidth = width

  const viewProps: UnknownObject = { ...props, style, onMouseDown, ref }
  if (down) {
    viewProps.onMouseMove = handleMouseMove
    viewProps.onMouseUp = handleMouseUp
    viewProps.onMouseLeave = handleMouseUp
  }
  return <View {...viewProps} />
}

export { Scrubber }
