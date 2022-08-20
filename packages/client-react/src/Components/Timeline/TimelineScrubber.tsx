import React from "react"
import { ClassDisabled, eventStop, EventType, pixelFromFrame, pixelToFrame, Point, pointsEqual, PointZero, timeFromArgs, UnknownObject } from "@moviemasher/moviemasher.js"

import { View } from "../../Utilities/View"
import { ReactResult, PropsWithChildren, WithClassName } from "../../declarations"
import { TimelineContext } from "./TimelineContext"
import { useListeners } from "../../Hooks/useListeners"
import { useEditor } from "../../Hooks/useEditor"


export interface TimelineScrubber extends PropsWithChildren, WithClassName {
  inactive?: boolean
  styleHeight?: boolean
  styleWidth?: boolean
}
/**
 * @parents Timeline
 */
export function TimelineScrubber(props: TimelineScrubber): ReactResult {
  const editor = useEditor()
  const clientXRef = React.useRef<number>(-1)
  const ref = React.useRef<HTMLDivElement>(null)
  const timelineContext = React.useContext(TimelineContext)
  const { frames,scale, rect } = timelineContext
  const { className, inactive, styleHeight, styleWidth, ...rest } = props

  const getDisabled = () => !editor.selection.mash
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => { setDisabled(getDisabled())}
  useListeners({ [EventType.Selection]: updateDisabled })
  
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
    const classes: string[] = []
    if (className) classes.push(className)
    if (disabled) classes.push(ClassDisabled)
    const viewProps: UnknownObject = { 
      ...rest, ref, className: classes.join(' ')
    }
    if (styleWidth || styleHeight) {
      const style: UnknownObject = {}
      if (styleHeight) style.minHeight = height
      if (styleWidth) {
        const width = pixelFromFrame(frames, scale, 'ceil')
        style.minWidth = Math.max(width, width)
      }
      viewProps.style = style
    }
    if (!(inactive || disabled)) viewProps.onPointerDown = addHandlers()
    
    return viewProps
  }

  const viewProps = React.useMemo(calculateViewProps, [frames, scale, width, height, disabled])
  return <View {...viewProps} />
}
