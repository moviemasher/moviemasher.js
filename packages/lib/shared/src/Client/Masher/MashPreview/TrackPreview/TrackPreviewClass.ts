import type { ClientClip, ClientVisibleInstance, Masher, SvgItem, SvgItems } from '@moviemasher/runtime-client'
import type { ContainerRectArgs, Direction, Instance, Point, Rect, Scalar, ScalarRecord, Size, Time, TimeRange } from '@moviemasher/runtime-shared'

import type { EventFunction } from '../../../EventFunction.js'
import type { ChangePropertiesActionObject } from '../../Actions/Action/ActionTypes.js'
import type { TrackPreview, TrackPreviewArgs } from './TrackPreview.js'

import { EventChangeClipId, EventChangeFrame, EventRect, MovieMasher } from '@moviemasher/runtime-client'

import { End } from '../../../../Base/PropertiedConstants.js'
import { tweenMinMax } from '../../../../Shared/Utility/Tween/TweenFunctions.js'
import { ActionTypeChangeMultiple } from '../../../../Setup/ActionTypeConstants.js'
import { DashChar } from '../../../../Setup/Constants.js'
import { isDefined } from '@moviemasher/runtime-shared'
import { DirectionLeft, DirectionTop, DirectionBottom, DirectionRight, assertSideDirection } from '../../../../Setup/DirectionConstants.js'
import { assertTrue } from '../../../../Shared/SharedGuards.js'
import { POINT_ZERO } from '../../../../Utility/PointConstants.js'
import { pointsEqual } from '../../../../Utility/PointFunctions.js'
import { assertRect, rectsEqual } from '../../../../Utility/RectFunctions.js'
import { assertSizeAboveZero } from '../../../../Utility/SizeFunctions.js'
import { eventStop } from '../../../EventFunctions.js'
import { svgAddClass, svgPolygonElement } from '../../../SvgFunctions.js'

export const TrackPreviewHandleSize = 8

export const TrackPreviewLineSize = 2


/**
 * MashPreview of a single track at a single frame, thus representing a single clip 
 */
export class TrackPreviewClass implements TrackPreview {
  constructor(public args: TrackPreviewArgs) {}

  get clip(): ClientClip { return this.args.clip }

  get container(): ClientVisibleInstance { return this.clip.container! }

  editingSvgItem(classes: string[], inactive?: boolean): SvgItem {
    // console.log(this.constructor.name, 'editingSvgItem', className)
    const { container, rect } = this
    const svgItem = container.pathElement(rect)

    svgItem.setAttribute('vector-effect', 'non-scaling-stroke')
    svgAddClass(svgItem, classes)
    if (!inactive) svgItem.addEventListener('pointerdown', this.pointerDownHandler(), { once: true })
  
    return svgItem
  }

  get editor(): Masher { return this.preview.editor! }

  get icon(): boolean { return !!this.args.icon }

  private pointerDownHandler() {
    const clickPoint = { ...POINT_ZERO }
    const { editor, container, timeRange, rect: myRect, clip } = this
    const pointsTweening = isDefined(container.value(`x${End}`)) || isDefined(container.value(`y${End}`))
    const event = new EventRect()
    MovieMasher.eventDispatcher.dispatch(event)
    const { rect: eventRect } = event.detail
    assertRect(eventRect)

    const removeWindowHandlers = () => {
      // console.log('removeWindowHandlers')
      globalThis.window.removeEventListener('pointermove', pointerMoveStart)
      globalThis.window.removeEventListener('pointermove', pointerMove)
      globalThis.window.removeEventListener('pointerup', pointerUp)
      globalThis.window.removeEventListener('pointerup', pointerDown)
    }

    const pointerUp = (event: MouseEvent) => {
      eventStop(event)
      removeWindowHandlers()
      // if (editor.dragging) {
        // console.log('pointerUp unsetting dragging and redrawing')
        editor.dragging = false
        editor.redraw()
      // }
    }

    const pointerMove = (event: MouseEvent) => {
      console.log(this.constructor.name, 'pointerMove')
      eventStop(event)

      const { leftConstrain, topConstrain, bottomConstrain, rightConstrain } = container
      const { x, y, width, height } = myRect
      let totalWidth = eventRect.width - width
      let totalHeight = eventRect.height - height
      let initialX = 0
      let initialY = 0
      if (!leftConstrain) {
        initialX -= width
        totalWidth += width
      }
      if (!rightConstrain) totalWidth += width
      if (!topConstrain) { 
        initialY -= height
        totalHeight += height
      }
      if (!bottomConstrain) totalHeight += height
      
      const { clientX, clientY, x: eventX, y: eventY } = event
      const localX = clientX - eventRect.x
      const localY = clientY - eventRect.y
      const clickX = clickPoint.x - eventRect.x
      const clickY = clickPoint.y - eventRect.y
      const xPos = localX - (clickX - x)
      const yPos = localY - (clickY - y)
      const limitedX = tweenMinMax(xPos, initialX, initialX + totalWidth)
      
      const limitedY = tweenMinMax(yPos, initialY, initialY + totalHeight)
      const { lastTime } = timeRange
      const timesEqual = editor.time.equalsTime(lastTime)
      const tweening = pointsTweening && timesEqual
      const xKey = tweening ? `x${End}` : 'x'
      const yKey = tweening ? `y${End}` : 'y'
      const xValue = container.value(xKey)
      const yValue = container.value(yKey)

      const undoValues: ScalarRecord = {}
      if (isDefined<Scalar>(xValue)) undoValues[xKey] = xValue
      if (isDefined<Scalar>(yValue)) undoValues[yKey] = yValue

      const redoValues: ScalarRecord = {
        [xKey]: totalWidth ? limitedX / totalWidth : undoValues[xKey],
        [yKey]: totalHeight ? limitedY / totalHeight : undoValues[yKey]
      }

      const { selection } = editor
      
      const args: ChangePropertiesActionObject = {
        redoSelection: selection,
        undoSelection: selection,
        property: 'point',
        target: container,
        type: ActionTypeChangeMultiple, redoValues, undoValues 
      }
      editor.actions.create(args)
    }

    const pointerMoveStart = (event: MouseEvent) => {
      // console.log('pointerMoveStart setting dragging')
      eventStop(event)
      const { clientX: x, clientY: y } = event
      const nowPoint = { x, y }
      if (pointsEqual(nowPoint, clickPoint)) return

      // make sure we're either not tweening, or on start/end frame
      if (pointsTweening) {
        const { time } = editor
        const closest = time.closest(timeRange)
        if (!time.equalsTime(closest)) {
          removeWindowHandlers()
          const frame = closest.scaleToFps(this.preview.mash.quantize).frame
          console.log(this.constructor.name, 'pointerMoveStart going to', frame)
          MovieMasher.eventDispatcher.dispatch(new EventChangeFrame(frame))
          return
        }
      }
      // set new move listener, and call it
      // console.log('pointerMoveStart setting dragging')
      editor.dragging = true
      globalThis.window.removeEventListener('pointermove', pointerMoveStart)
      globalThis.window.addEventListener('pointermove', pointerMove)
      pointerMove(event)
    }

    const pointerDown: EventFunction = event => {
      eventStop(event)
      // event.stopPropagation()
      if (!(event instanceof PointerEvent)) return 
      
      const { clientX: x, clientY: y } = event
      clickPoint.x = x
      clickPoint.y = y
      // console.log(this.constructor.name, 'pointerDown', clickPoint)

      globalThis.window.addEventListener('pointermove', pointerMoveStart)
      globalThis.window.addEventListener('pointerup', pointerUp)
      if (editor.selection !== clip) editor.selection = clip
    }
    return pointerDown
  }

  private get preview() { return this.args.preview }

  private _rect?: Rect
  private get rect() { return this._rect || this.rectInitialize }
  private get rectInitialize() {
    const { time, timeRange, clip, size } = this
    assertSizeAboveZero(size, `${this.constructor.name}.rectInitialize size`)
    const containerRectArgs: ContainerRectArgs = {
      size, time, timeRange, editing: true,
    }
    const containerRects = clip.rects(containerRectArgs)
    assertTrue(containerRects.length === 1)

    return containerRects[0]
  }
  
  private get size(): Size { return this.preview.size }

  svgBoundsElement(lineClasses: string[], handleClasses: string[], inactive?: boolean): SvgItems {
    const items: SvgItems = []
    const handle = TrackPreviewHandleSize
    const line = TrackPreviewLineSize 
    const halfLine = line / 2
    const { rect, container } = this
    const { directions } = container
    const { width, height, x, y } = rect
    const lineRect = { x: x - halfLine, y: y - halfLine, width: width, height: line }
    
    items.push(svgPolygonElement(lineRect, lineClasses))
    lineRect.y = y + height - halfLine
    items.push(svgPolygonElement(lineRect, lineClasses))
    lineRect.x = x + width - halfLine
    lineRect.height = height
    lineRect.width = line
    lineRect.y = y
    items.push(svgPolygonElement(lineRect, lineClasses))
    lineRect.x = x - halfLine
    items.push(svgPolygonElement(lineRect, lineClasses))

    const { id } = this.clip
    const size = { width, height }
    directions.forEach(direction => {
      const point = this.svgHandlePoint(size, direction)
      const rect = { x: x + point.x, y: y + point.y, width: handle, height: handle }
      const element = svgPolygonElement(rect, [...handleClasses, direction.toLowerCase()])
      items.push(element)
      if (inactive) return 

      const pointerDown: EventFunction = (pointerEvent) => {
        eventStop(pointerEvent)
        // console.log(this.constructor.name, 'pointerDown', id)
        MovieMasher.eventDispatcher.dispatch(new EventChangeClipId(id))
      }
      element.addEventListener('pointerdown', pointerDown, { once: true })
    })
    // svgSetTransformPoint(groupElement, rect)
    return items
  }

  private svgHandlePoint(dimensions: Size, direction: Direction): Point {
    const handle = TrackPreviewHandleSize
    const halfHandle = handle / 2

    const { width, height } = dimensions
    const point = { ...POINT_ZERO }
    const [first, second] = String(direction).split(DashChar)
    assertSideDirection(first, direction)

    const last = second || first
    assertSideDirection(last)

    switch(last) {
      case DirectionRight:
        point.x = - halfHandle
        break
      case DirectionLeft:
        point.x = width - halfHandle
        break
      default: point.x = Math.round(width / 2) - halfHandle
    }
    switch(first) {
      case DirectionTop:
        point.y = - halfHandle
        break
      case DirectionBottom: 
        point.y = height - halfHandle
        break
      default: point.y = Math.round(height / 2) - halfHandle
    }
    return point
  }

  private get time(): Time { return this.preview.time }

  private _timeRange?: TimeRange
  private get timeRange() { return this._timeRange ||= this.clip.timeRange }
}
