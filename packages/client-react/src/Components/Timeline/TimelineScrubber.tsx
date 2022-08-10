import React from "react"
import { eventStop, pixelFromFrame, pixelToFrame, Point, pointsEqual, PointZero, timeFromArgs, UnknownObject } from "@moviemasher/moviemasher.js"

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
  if (!editor) return null

  const addHandlers = () => {
    const { window } = globalThis

    const removeWindowHandlers = () => {
      window.removeEventListener('pointermove', pointerMove)
      window.removeEventListener('pointerup', pointerUp)
    }

    const pointerMove = (event: MouseEvent) => {
      eventStop(event)
      
      const { current } = ref
      if (!(current && editor.selection.mash)) return

      const { clientX } = event
      if (clientXRef.current === clientX) return

      clientXRef.current = clientX

      const rect = current.getBoundingClientRect()
      const pixel = Math.max(0, Math.min(rect.width, clientX - rect.x))
      const frame = pixelToFrame(pixel, scale, 'floor')
      editor.time = timeFromArgs(frame, editor.selection.mash!.quantize)
    }

    const pointerUp = (event: MouseEvent) => {
      pointerMove(event)
      removeWindowHandlers()
    }   

    const pointerDown = (event: MouseEvent) => {
      clientXRef.current = -1
      window.addEventListener('pointermove', pointerMove)
      window.addEventListener('pointerup', pointerUp)
      pointerMove(event)
    }    
    return pointerDown
  }

  const { width, height } = rect
  const calculateViewProps = () => {
    const viewProps: UnknownObject = { ...rest, ref }
    if (styleWidth || styleHeight) {
      const style: UnknownObject = {}
      if (styleHeight) style.minHeight = height
      if (styleWidth) {
        const width = pixelFromFrame(frames, scale, 'ceil')
        style.minWidth = Math.max(width, width)
      }
      viewProps.style = style
    }
    if (!inactive) viewProps.onPointerDown = addHandlers()
    
    return viewProps
  }

  const viewProps = React.useMemo(calculateViewProps, [frames, scale, width, height])
  return <View {...viewProps} />
}
