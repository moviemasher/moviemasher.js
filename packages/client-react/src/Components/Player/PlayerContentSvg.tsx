import React from 'react'
import {
  eventStop, Point,
  pointsEqual, tweenMinMax,
  PointZero, Rect, Svg, UnknownObject, tweeningPoints, assertClip, assertRect, assertContainer, ScalarObject, PropertyTweenSuffix, ActionObject, DataGroup, ActionType
} from '@moviemasher/moviemasher.js'

import { PropsWithoutChild, ReactResult } from '../../declarations'
import { useEditor } from '../../Hooks/useEditor'

export interface PlayerContentSvgProps extends PropsWithoutChild, Svg {
  contentRect: Rect
}

export function PlayerContentSvg(props: PlayerContentSvgProps): ReactResult {
  const [clickPoint, setClickPoint] = React.useState<Point>(() => ({ ...PointZero }))

  const editor = useEditor()
  const ref = React.useRef<SVGSVGElement>(null)
  const { element, id: key, changeHandler, contentRect, clip, rect } = props
  const updateRef = () => {
    const { current } = ref
    if (current)
      current.replaceChildren(element)
  }

  React.useEffect(updateRef, [])
  if (ref.current)
    updateRef()

  const addHandlers = () => {
    assertClip(clip)
    assertRect(contentRect)
    assertRect(rect)
    // console.log("SvgContent svgEditingContent pointerMove contentRect, rect", contentRect, rect)


    const { container, track } = clip
    assertContainer(container)

    const { quantize } = track.mash
    const timeRange = clip.timeRange(quantize)
    const { lastTime } = timeRange
    const { window } = globalThis

    const removeWindowHandlers = () => {
      window.removeEventListener('pointermove', pointerMoveStart)
      window.removeEventListener('pointermove', pointerMove)
      window.removeEventListener('pointerup', pointerUp)
    }

    const pointerUp = (event: MouseEvent) => {
      removeWindowHandlers()
      // console.log("SvgContent svgEditingContent pointerUp", event)
      eventStop(event)
    }

    const pointerMove = (event: MouseEvent) => {
      eventStop(event)
      // console.log("SvgContent svgEditingContent pointerMove clientX, clientY", clientX, clientY)


      const { offE, offN, offS, offW } = container
      const { x, y, width, height } = rect
      let totalWidth = contentRect.width - width
      let totalHeight = contentRect.height - height
      let initialX = 0
      let initialY = 0
      if (offE) {
        initialX -= width
        totalWidth += width
      }
      if (offW) totalWidth += width
      if (offN) { 
        initialY -= height
        totalHeight += height
      }
      if (offS) totalHeight += height
      
      const { clientX, clientY } = event
      const localX = clientX - contentRect.x
      const localY = clientY - contentRect.y
      const clickX = clickPoint.x - contentRect.x
      const clickY = clickPoint.y - contentRect.y
      const xPos = localX - (clickX - x)
      const yPos = localY - (clickY - y)
      const limitedX = tweenMinMax(xPos, initialX, initialX + totalWidth)
      
      const limitedY = tweenMinMax(yPos, initialY, initialY + totalHeight)
      const pointsTweening = tweeningPoints(container)
      const timesEqual = editor.time.equalsTime(lastTime)
      const tweening = pointsTweening && timesEqual
      const xKey = tweening ? `x${PropertyTweenSuffix}` : 'x'
      const yKey = tweening ? `y${PropertyTweenSuffix}` : 'y'
      
      const undoValues: ScalarObject = {
        [xKey]: container.value(xKey), [yKey]: container.value(yKey)
      }

      const redoValues: ScalarObject = {
        [xKey]: totalWidth ? limitedX / totalWidth : undoValues[xKey],
        [yKey]: totalHeight ? limitedY / totalHeight : undoValues[yKey]
      }
      
      // console.log("SvgContent svgEditingContent pointerMove", pointsTweening, timesEqual, redoValues)
      const args: ActionObject = {
        property: DataGroup.Point, target: container,
        type: ActionType.ChangeMultiple, redoValues, undoValues 
      }
      editor.actions.create(args)
    }

    const pointerMoveStart = (event: MouseEvent) => {
      eventStop(event)
      const { clientX: x, clientY: y } = event
      const nowPoint = { x, y }
      if (pointsEqual(nowPoint, clickPoint)) return

      // make sure we're either not tweening, or on start/end frame
      if (tweeningPoints(container)) {
        const { time } = editor
        const closest = time.closest(timeRange)
        if (!time.equalsTime(closest)) {
          removeWindowHandlers()
          editor.goToTime(closest)
          return
        }
      }
      // replace move listener, and call new one
      window.removeEventListener('pointermove', pointerMoveStart)
      window.addEventListener('pointermove', pointerMove)
      pointerMove(event)
    }

    const pointerDown = (event: MouseEvent) => {
      eventStop(event)
      const { clientX: x, clientY: y } = event
      setClickPoint(original => {
        original.x = x
        original.y = y
        return original
      })

      // console.log("SvgContent svgEditingContent pointerDown", event)
      window.addEventListener('pointermove', pointerMoveStart)
      window.addEventListener('pointerup', pointerUp)
      editor.selection.set(clip)
    }

    return pointerDown
  }

  const { x, y, width, height } = contentRect
  const viewProps: UnknownObject = {
    key, ref,
    width, height, viewBox: `0 0 ${width} ${height}`
  }
  if (changeHandler) viewProps.onPointerDown = addHandlers()

  return <svg {...viewProps} />
}
