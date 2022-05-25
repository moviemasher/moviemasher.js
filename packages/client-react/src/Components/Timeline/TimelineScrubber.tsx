import React from "react"
import { pixelFromFrame, pixelToFrame, timeFromArgs, UnknownObject } from "@moviemasher/moviemasher.js"

import { View } from "../../Utilities/View"
import { ReactResult, PropsWithChildren } from "../../declarations"
import { TimelineContext } from "../../Contexts/TimelineContext"
import { EditorContext } from "../../Contexts/EditorContext"


export interface TimelineScrubber extends PropsWithChildren {
  inactive?: boolean
  styleHeight?: boolean
  styleWidth?: boolean
}
/**
 * @parents Timeline
 */
export function TimelineScrubber(props: TimelineScrubber): ReactResult {
  const clientXRef = React.useRef<number>(-1)
  const ref = React.useRef<HTMLDivElement>(null)
  const timelineContext = React.useContext(TimelineContext)
  const editorContext = React.useContext(EditorContext)
  const { frames, editor } = editorContext
  const { scale, rect } = timelineContext
  const { inactive, styleHeight, styleWidth, ...rest } = props
  const [down, setDown] = React.useState(() => false)
  if (!editor) return null

  const handleEvent = (event: React.MouseEvent<HTMLDivElement>) => {
    const { current } = ref
    if (!(current && editor.selection.mash)) return

    const { clientX } = event
    if (clientXRef.current === clientX) return

    clientXRef.current = clientX

    const rect = current.getBoundingClientRect()
    const pixel = Math.max(0, Math.min(rect.width, clientX - rect.x))
    const frame = pixelToFrame(pixel, scale, 'floor')
    editor.time = timeFromArgs(frame, editor.fps)
  }

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    clientXRef.current = -1
    setDown(true)
    handleEvent(event)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!down) return
    handleEvent(event)
  }

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    setDown(false)
    handleEvent(event)
  }

  const calculateViewProps = () => {
    const viewProps: UnknownObject = { ...rest, ref }
    if (styleWidth || styleHeight) {
      const style: UnknownObject = {}
      if (styleHeight) style.minHeight = rect.height
      if (styleWidth) {
        const width = pixelFromFrame(frames, scale, 'ceil')
        style.minWidth = Math.max(width, rect.width)
      }
      viewProps.style = style
    }
    if (!inactive) {
      viewProps.onMouseDown = onMouseDown
      if (down) {
        viewProps.onMouseMove = handleMouseMove
        viewProps.onMouseUp = handleMouseUp
        viewProps.onMouseLeave = handleMouseUp
      }
    }
    return viewProps
  }

  const viewProps =  React.useMemo(calculateViewProps, [down, frames, scale, rect])
  return <View {...viewProps} />
}
