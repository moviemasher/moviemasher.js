import type { ClientClip, ClientVisibleInstance, EventFunction, SvgItem, SvgItems } from '@moviemasher/runtime-client'
import type { ContainerRectArgs, Direction, Point, Rect, ScalarsById, Size, Time, TimeRange } from '@moviemasher/runtime-shared'
import type { TrackPreview, TrackPreviewArgs } from './TrackPreview.js'

import { DOT, DirectionBottom, DirectionLeft, DirectionRight, DirectionTop, assertRect, assertSideDirection, assertSizeAboveZero, assertTrue, pointTranslate, pointsEqual, sizeTranslate, timeFromArgs, tweenMinMax } from '@moviemasher/lib-shared'
import { EventChangeClipId, EventChangeDragging, EventChangeFrame, EventChangeScalars, EventFrame, EventRect, MovieMasher, eventStop } from '@moviemasher/runtime-client'
import { Aspect, Crop, End, POINT_ZERO, TypeContainer, isDefined } from '@moviemasher/runtime-shared'
import { svgAddClass, svgPolygonElement } from '../../../SvgFunctions.js'

export const TrackPreviewHandleSize = 8

export const TrackPreviewLineSize = 2

/**
 * MashPreview of a single track at a single frame, thus representing a single clip 
 */
export class TrackPreviewClass implements TrackPreview {
  constructor(public args: TrackPreviewArgs) {}
  
  get clip(): ClientClip { return this.args.clip }

  private _timeRange?: TimeRange
  private get clipTimeRange() { return this._timeRange ||= this.clip.timeRange }

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

  get icon(): boolean { return !!this.args.icon }

  private pointerDownHandler() {
    const event = new EventRect()
    MovieMasher.eventDispatcher.dispatch(event)
    const { rect: previewRect } = event.detail
    assertRect(previewRect)

    const clickPoint = { ...POINT_ZERO }
    const offsetPoint = { ...POINT_ZERO }

    const { container, clipTimeRange: range, rect: clipRect, clip } = this

    const pointAspect = container.value(`point${Aspect}`)
    const flipped = pointAspect && previewRect.width < previewRect.height
 
    const horzPointKey = flipped ? 'y' : 'x'
    const vertPointKey = flipped ? 'x' : 'y'
    const horzEndKey = `${horzPointKey}${End}`
    const vertEndKey = `${vertPointKey}${End}`

    const pointTweening = (
      isDefined(container.value(horzEndKey)) || isDefined(container.value(vertEndKey))
    )


    const removeWindowHandlers = () => {
      globalThis.window.removeEventListener('pointermove', pointerMoveStart)
      globalThis.window.removeEventListener('pointermove', pointerMove)
      globalThis.window.removeEventListener('pointerup', pointerUp)
      globalThis.window.removeEventListener('pointerup', pointerDown)
    }

    const pointerUp = (event: MouseEvent) => {
      eventStop(event)
      removeWindowHandlers()
      MovieMasher.eventDispatcher.dispatch(new EventChangeDragging(false))
    }

    const nowPoint = (event: MouseEvent): Point => {
      const { clientX: x, clientY: y } = event
      return { x, y }
    }

    const pointerMove = (event: MouseEvent) => {
      eventStop(event)

      // localize mouse point to preview rect
      const currentPoint = pointTranslate(nowPoint(event), previewRect, true)

      // remove any offset from the down point
      const movePoint = pointTranslate(currentPoint, offsetPoint, true)
        
      const leftCrop = container.value(`${flipped ? 'top' : 'left'}${Crop}`)
      const rightCrop = container.value(`${flipped ? 'bottom' : 'right'}${Crop}`)
      const topCrop = container.value(`${flipped ? 'left' : 'top'}${Crop}`)
      const bottomCrop = container.value(`${flipped ? 'right' : 'bottom'}${Crop}`)
      
      const totalSize = sizeTranslate(previewRect, clipRect, true)
      
      
   
      const zeroPoint = { ...POINT_ZERO }
      if (leftCrop) {
        zeroPoint.x -= clipRect.width
        totalSize.width += clipRect.width
      }
      if (rightCrop) {
        totalSize.width += clipRect.width
      }
      if (topCrop) { 
        zeroPoint.y -= clipRect.height
        totalSize.height += clipRect.height
      }
      if (bottomCrop) {
        totalSize.height += clipRect.height
      }
      const offset = pointTranslate(movePoint, zeroPoint, true)

      const limitedPoint: Point = {
        x: tweenMinMax(offset.x, 0, totalSize.width),
        y: tweenMinMax(offset.y, 0, totalSize.height),
      }
    
      const timeEvent = new EventFrame()
      MovieMasher.eventDispatcher.dispatch(timeEvent)
      const tweening = pointTweening && timeEvent.detail.frame === range.lastTime.frame
  
      const horzId = `${TypeContainer}${DOT}${tweening ? horzEndKey : horzPointKey}`
      const vertId = `${TypeContainer}${DOT}${tweening ? vertEndKey : vertPointKey}`

      const redoValues: ScalarsById = { 
        [horzId]: totalSize.width ? limitedPoint.x / totalSize.width : container.value(horzId), 
        [vertId]: totalSize.height ? limitedPoint.y / totalSize.height : container.value(vertId), 
      }
      const undoValues = {
        [horzId]: container.value(horzId),
        [vertId]: container.value(vertId),
      }
      console.log(this.constructor.name, 'pointerMove', pointsEqual(limitedPoint, movePoint), undoValues, '->', redoValues)

      MovieMasher.eventDispatcher.dispatch(new EventChangeScalars(redoValues))
    }

    const pointerMoveStart = (event: MouseEvent) => {
      // console.log('pointerMoveStart setting dragging')
      eventStop(event)
      const { clientX: x, clientY: y } = event
      if (pointsEqual({ x, y }, clickPoint)) return

      // make sure we're either not tweening, or on start/end frame
      if (pointTweening) {
        const frameEvent = new EventFrame()
        MovieMasher.eventDispatcher.dispatch(frameEvent)
        const { frame = 0 } = frameEvent.detail
        const time = timeFromArgs(frame, range.fps)
        const closest = time.closest(range)
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
      MovieMasher.eventDispatcher.dispatch(new EventChangeDragging(true))
     
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
      
      const downPoint = pointTranslate(clickPoint, previewRect, true) 

      // console.log(this.constructor.name, 'pointerDown', clickPoint)
      const point = pointTranslate(downPoint, clipRect, true)
      offsetPoint.x = point.x
      offsetPoint.y = point.y

      globalThis.window.addEventListener('pointermove', pointerMoveStart)
      globalThis.window.addEventListener('pointerup', pointerUp)

      MovieMasher.eventDispatcher.dispatch(new EventChangeClipId(clip.id))
    }
    return pointerDown
  }

  private get preview() { return this.args.preview }

  private _rect?: Rect
  private get rect() { return this._rect || this.rectInitialize }
  private get rectInitialize() {
    const { time, clipTimeRange: timeRange, clip, size } = this
    assertSizeAboveZero(size, `${this.constructor.name}.rectInitialize size`)
    const containerRectArgs: ContainerRectArgs = {
      size, time, timeRange, editing: true,
    }
    const containerRects = clip.containerRects(containerRectArgs)
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
    const [first, second] = String(direction).split('-')
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
}
