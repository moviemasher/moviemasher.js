import { Container, ContainerRectArgs } from "../../../Media/Container/Container"
import { ScalarRecord } from "../../../declarations"
import { SvgItem, SvgItems } from "../../../Helpers/Svg/Svg"
import { Point, pointsEqual, PointZero } from "../../../Utility/Point"
import { Rect, rectsEqual } from "../../../Utility/Rect"
import { assertSizeAboveZero, Size } from "../../../Utility/Size"
import { Clip } from "../../../Media/Mash/Track/Clip/Clip"
import { svgAddClass, svgPolygonElement } from "../../../Helpers/Svg/SvgFunctions"
import { TrackPreview, TrackPreviewArgs } from "./TrackPreview"
import { assertTrue } from "../../../Utility/Is"
import { ActionType, Anchor, assertDirection, Direction } from "../../../Setup/Enums"
import { Editor } from "../../Editor"
import { Time, TimeRange } from "../../../Helpers/Time/Time"
import { tweeningPoints, tweenMinMax } from "../../../Utility/Tween"
import { PropertyTweenSuffix } from "../../../Base/Propertied"
import { DataGroup } from "../../../Setup/Property"
import { ActionOptions } from "../../Actions/Action/Action"
import { eventStop } from "../../../Utility/Event"

export const TrackPreviewHandleSize = 8

export const TrackPreviewLineSize = 2

/**
 * Preview of a single track at a single frame, thus representing a single clip 
 */
export class TrackPreviewClass implements TrackPreview {
  constructor(public args: TrackPreviewArgs) {}

  get clip(): Clip { return this.args.clip }

  get container(): Container { return this.clip.container! }

  editingSvgItem(classes: string[], inactive?: boolean): SvgItem {
    // console.log(this.constructor.name, "editingSvgItem", className)
    const { container, rect } = this
    const svgItem = container.pathElement(rect)

    svgItem.setAttribute('vector-effect', 'non-scaling-stroke')
    svgAddClass(svgItem, classes)
    if (!inactive) svgItem.addEventListener('pointerdown', this.pointerDownHandler())
  
    return svgItem
  }

  get editor(): Editor { return this.preview.editor! }

  get icon(): boolean { return !!this.args.icon }

  private pointerDownHandler() {
    const clickPoint = { ...PointZero }
    const { editor, container, timeRange, rect, clip } = this
    const { rect: contentRect } = editor

   
    const removeWindowHandlers = () => {
      // console.log("removeWindowHandlers")
      globalThis.window.removeEventListener('pointermove', pointerMoveStart)
      globalThis.window.removeEventListener('pointermove', pointerMove)
      globalThis.window.removeEventListener('pointerup', pointerUp)
      globalThis.window.removeEventListener('pointerup', pointerDown)
    }

    const pointerUp = (event: MouseEvent) => {
      eventStop(event)
      removeWindowHandlers()
      // if (editor.dragging) {
        // console.log("pointerUp unsetting dragging and redrawing")
        editor.dragging = false
        editor.redraw()
      // }
    }

    const pointerMove = (event: MouseEvent) => {
      // console.log("pointerMove")
      eventStop(event)

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
      const { lastTime } = timeRange
      const timesEqual = editor.time.equalsTime(lastTime)
      const tweening = pointsTweening && timesEqual
      const xKey = tweening ? `x${PropertyTweenSuffix}` : 'x'
      const yKey = tweening ? `y${PropertyTweenSuffix}` : 'y'
      
      const undoValues: ScalarRecord = {
        [xKey]: container.value(xKey), [yKey]: container.value(yKey)
      }

      const redoValues: ScalarRecord = {
        [xKey]: totalWidth ? limitedX / totalWidth : undoValues[xKey],
        [yKey]: totalHeight ? limitedY / totalHeight : undoValues[yKey]
      }
      
      const args: ActionOptions = {
        property: DataGroup.Point, target: container,
        type: ActionType.ChangeMultiple, redoValues, undoValues 
      }
      editor.actions.create(args)
    }

    const pointerMoveStart = (event: MouseEvent) => {
      // console.log("pointerMoveStart setting dragging")
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
          // console.log("pointerMoveStart going to", closest)
          editor.goToTime(closest)
          return
        }
      }
      // set new move listener, and call it
      // console.log("pointerMoveStart setting dragging")
      editor.dragging = true
      globalThis.window.removeEventListener('pointermove', pointerMoveStart)
      globalThis.window.addEventListener('pointermove', pointerMove)
      pointerMove(event)
    }

    const pointerDown = (event: Event) => {
      // console.log("pointerDown")
      eventStop(event)
      // event.stopPropagation()
      if (!(event instanceof PointerEvent)) return 
      
      const { clientX: x, clientY: y } = event
      clickPoint.x = x
      clickPoint.y = y
      
      globalThis.window.addEventListener('pointermove', pointerMoveStart)
      globalThis.window.addEventListener('pointerup', pointerUp)
      if (editor.selection.clip !== clip) {
        editor.selection.set(clip)
      }
    }
    return pointerDown
  }

  private get preview() { return this.args.preview }

  private get quantize() { return this.preview.quantize }

  private _rect?: Rect
  private get rect() { return this._rect || this.rectInitialize }
  private get rectInitialize() {
    const { time, timeRange, clip, size } = this
    assertSizeAboveZero(size, `${this.constructor.name}.rectInitialize size`)
    const containerRectArgs: ContainerRectArgs = {
      size, time, timeRange, editing: true,
    }
    const containerRects = clip.rects(containerRectArgs)
    assertTrue(rectsEqual(...containerRects))

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

    const size = { width, height }
    directions.forEach(direction => {
      const point = this.svgHandlePoint(size, direction)
      const rect = { x: x + point.x, y: y + point.y, width: handle, height: handle }
      const element = svgPolygonElement(rect, [...handleClasses, direction.toLowerCase()])
      items.push(element)
      if (inactive) return 

      element.addEventListener('pointerdown', (event: Event) => {
        // console.log("pointerdown", direction)
        this.editor.selection.set(this.clip)
        eventStop(event)
      })
    })
    // svgSetTransformPoint(groupElement, rect)
    return items
  }

  private svgHandlePoint(dimensions: Size, direction: Anchor): Point {
    const handle = TrackPreviewHandleSize
    const halfHandle = handle / 2

    const { width, height } = dimensions
    const point = { ...PointZero }
    const [first, second] = String(direction).split('')
    assertDirection(first, direction)

    const last = second || first
    assertDirection(last)

    switch(last) {
      case Direction.W:
        point.x = - halfHandle
        break
      case Direction.E:
        point.x = width - halfHandle
        break
      default: point.x = Math.round(width / 2) - halfHandle
    }
    switch(first) {
      case Direction.N:
        point.y = - halfHandle
        break
      case Direction.S: 
        point.y = height - halfHandle
        break
      default: point.y = Math.round(height / 2) - halfHandle
    }
    return point
  }

  private get time(): Time { return this.preview.time }

  private _timeRange?: TimeRange
  private get timeRange() { return this._timeRange ||= this.clip.timeRange(this.quantize) }
}
