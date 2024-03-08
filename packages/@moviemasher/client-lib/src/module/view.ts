import type { AudibleInstance, AudioPreview, ClientClip, ClientClips, ClientInstance, ClientMashAsset, ClientMashDescription, ClientMashDescriptionArgs, Clip, ContainerInstance, ContainerRectArgs, DataOrError, Direction, InstanceCacheArgs, NumberRecord, Point, PointOrSize, PropertyIds, Rect, ScalarsById, SegmentDescription, SegmentDescriptionArgs, SideDirectionRecord, Size, Strings, SvgItem, SvgItems, SyncFunction, Time, TimeRange } from '@moviemasher/shared-lib/types.js'
import type { EventHandler } from '../types.js'

import { MashDescriptionClass } from '@moviemasher/shared-lib/base/description.js'
import { AUDIBLE_CONTEXT } from '@moviemasher/shared-lib/mixin/client-audible.js'
import { $ASPECT, $AUDIO, $BOTTOM, $CONTAINER, $CROP, $END, $FLIP, $HEIGHT, $IMAGE, $LEFT, $MASH, $NONE, $PLAYER, $POINT, $RIGHT, $ROUND, $SIZE, $TEXT, $TIMELINE, $TOP, $WIDTH, DASH, DIRECTIONS_ALL, DOT, ERROR, MOVIE_MASHER, POINT_KEYS, POINT_ZERO, SIZE_KEYS, VOID_FUNCTION, errorThrow, isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { assertClientAudibleInstance, assertDatasetElement, isClientAudibleInstance } from '@moviemasher/shared-lib/utility/client-guards.js'
import { isAboveZero, isDefined, isNumber, isPositive } from '@moviemasher/shared-lib/utility/guard.js'
import { assertDefined, assertRect } from '@moviemasher/shared-lib/utility/guards.js'
import { assertSizeNotZero, copyPoint, roundPoint, translatePoint } from '@moviemasher/shared-lib/utility/rect.js'
import { simplifyRecord, svgAddClass, svgAppend, svgGroupElement, svgPolygonElement, svgSvgElement } from '@moviemasher/shared-lib/utility/svg.js'
import { timeRangeFromTime } from '@moviemasher/shared-lib/utility/time.js'
import { ANIMATE, BACK, BOUNDS, FORE, HANDLE, LAYER, LINE, OUTLINE, OUTLINES } from '../utility/constants.js'
import { EventChangeClipId, EventChangeFrame, EventChangeScalars, EventRect, eventStop } from './event.js'

interface ClientSegmentDescription extends SegmentDescription {
  clip: ClientClip
  /** Item for display of clip itself */
  svgItem(animate: boolean): SvgItem
  /** Items for display of clip's bounds and outline. */
  svgItems(lineClasses: string[], handleClasses: string[], inactive?: boolean): SvgItems 
}

interface ClientSegmentDescriptions extends Array<ClientSegmentDescription>{}

interface ClientSegmentDescriptionArgs extends SegmentDescriptionArgs {
  clip: ClientClip
  mashDescription: ClientMashDescription
}

export interface StartOptions {
  duration: number
  offset?: number
  start: number
}

interface Doing {
  /** offset relative to container rect for Pointing,  */
  offsetPoint: Point
  pointFlipping: boolean
  pointTweening: boolean
  moveHandler: EventHandler<PointerEvent>
  moved?: boolean
  clickedNumbers: NumberRecord
}

interface Sizing extends Doing {
  sizeFlipping: boolean
  sizeTweening: boolean
  direction: string
  clickedPreviewPoint: Point
  clickedRect: Rect
}

interface Pointing extends Doing {}


interface AudioPreviewArgs {
  buffer?: number

}

class AudioPreviewClass implements AudioPreview {
  constructor(args: AudioPreviewArgs = {}) {
    const { buffer } = args
    if (isPositive(buffer)) this.buffer = buffer
  }

  adjustGain(audibleInstance: AudibleInstance): void {
    const source = AUDIBLE_CONTEXT.getSource(audibleInstance.id)
    if (!source) return

    const { gainNode } = source
    gainNode.gain.value = audibleInstance.number('gain')
  
    // const speed = audibleInstance.number('speed')
    // const gain = audibleInstance.number('gain')
    // if (isPositive(gain)) {
    //   gainNode.gain.value = gain
    //   return
    // }
    // // position/gain pairs...
    // const { start, duration } = options
    // gainNode.gain.cancelScheduledValues(0)
    // audibleInstance.gainPairs.forEach(pair => {
    //   const [position, value] = pair
    //   gainNode.gain.linearRampToValueAtTime(this.gain * value, start + (position * duration * speed))
    // })
  }

  buffer: number = 10

  bufferClips(clips: Clip[], quantize: number): boolean {
    // console.log(this.constructor.name, 'bufferClips', clips.length)
    if (!this.createSources(clips, quantize)) return false

    this.destroySources(clips)
    return true
  }

  private bufferSource?: AudioBufferSourceNode

  clear() {}

  private audibleInstances(clip: Clip): AudibleInstance[] {
    const instances: AudibleInstance[] = []
    const { container, content } = clip
    if (isClientAudibleInstance(container) && !container.muted) instances.push(container)
    if (isClientAudibleInstance(content) && !content.muted) instances.push(content)
    return instances
  }

  private createSources(clips: Clip[], _quantize: number, time?:Time): boolean {
    if (!this.playing && !time) return false

    const addingClips = clips.filter(clip => !this.playingClips.includes(clip))
    // console.log(this.constructor.name, 'createSources', addingClips.length, 'addingClip(s)')
    if (!addingClips.length) return true

    let okay = true
    addingClips.forEach(clip => {
      const audibleInstances = this.audibleInstances(clip)
      const { timeRange } = clip
      const filtered = audibleInstances.filter(av => !AUDIBLE_CONTEXT.hasSource(av.id))
      // console.log(this.constructor.name, 'createSources', audibleInstances.length, filtered.length, 'audibleInstance(s)')
      okay &&= filtered.every(audibleInstance => {
        const startSeconds = this.playing ? this.seconds: time?.seconds || 0

        const options = this.startOptions(audibleInstance, startSeconds, timeRange)
        const { start, duration, offset } = options

        if (isPositive(start) && isAboveZero(duration)) {
          assertClientAudibleInstance(audibleInstance)

          const { asset, id } = audibleInstance
          const source = asset.audibleSource()
          if (!source) return start ? true : !asset.canBeMuted
          
          // console.log(this.constructor.name, 'createSources starting', asset.label, start, duration, offset)
          AUDIBLE_CONTEXT.startAt(id, source, start, duration, audibleInstance.number('speed'), offset)

          this.adjustGain(audibleInstance)
        } 
        return true
      })
    })
    this.playingClips.push(...addingClips)
    return okay
  }

  private startOptions(instance: AudibleInstance, startSeconds: number, timeRange: TimeRange): StartOptions {
    const { fps } = timeRange
    const [_, startTrimFrame] = instance.assetFrames(fps)
    let duration = timeRange.lengthSeconds
    let start = timeRange.seconds - startSeconds
    let offset = (startTrimFrame / fps) //* speed
    if (start < 0) {
      duration += start //* speed
      offset -= start //* speed
      start = 0
    }
    return { start, offset, duration }
  }

  private destroySources(clipsToKeep: Clip[] = []): void {
    const sourceClips = [...this.playingClips]
    const clipsToRemove = sourceClips.filter(clip => !clipsToKeep.includes(clip))

    clipsToRemove.forEach(clip => {
      const avs = this.audibleInstances(clip)
      avs.forEach(av => AUDIBLE_CONTEXT.deleteSource(av.id))
    })
    this.playingClips = clipsToKeep
  }

  // setGain(value: number, quantize: number) {
  //   if (this.gain === value) return

  //   this.gain = value

  //   if (this.playing) {
  //     this.playingClips.forEach(clip => this.adjustClipGain(clip))
  //   }

  // }

  private playing = false

  private playingClips: Clip[] = []

  get seconds(): number {
    const ellapsed = AUDIBLE_CONTEXT.currentTime - this.contextSecondsWhenStarted
    return ellapsed + this.startedMashAt
  }

  startContext(): void {
    // console.log(this.constructor.name, 'startContext')
    if (this.bufferSource) errorThrow(ERROR.Internal) 
    if (this.playing) errorThrow(ERROR.Internal) 

    const buffer = AUDIBLE_CONTEXT.createBuffer(this.buffer)
    this.bufferSource = AUDIBLE_CONTEXT.createBufferSource(buffer)
    if (!this.bufferSource) errorThrow(ERROR.Internal)

    this.bufferSource.loop = true
    this.bufferSource.connect(AUDIBLE_CONTEXT.destination)
    this.bufferSource.start(0)
  }

  // called when playhead starts moving
  startPlaying(time: Time, clips: Clip[], quantize: number): boolean {
    if (!this.bufferSource) errorThrow(ERROR.Internal) 
    if (this.playing) errorThrow(ERROR.Internal)

    const { seconds } = time
    this.playing = true
    this.startedMashAt = seconds
    this.contextSecondsWhenStarted = AUDIBLE_CONTEXT.currentTime

    if (!this.createSources(clips, quantize, time)) {    
      this.stopPlaying()
      return false
    }
    return true
  }

  // position of masher (in seconds) when startPlaying called
  private startedMashAt = 0

  // currentTime of audioContext (in seconds) was created when startPlaying called
  private contextSecondsWhenStarted = 0

  stopContext(): void {
    if (!this.bufferSource) return

    this.bufferSource.stop()
    this.bufferSource.disconnect(AUDIBLE_CONTEXT.destination)
    delete this.bufferSource
  }

  stopPlaying(): void {
    if (!this.playing) return

    this.playing = false
    this.destroySources()
    this.startedMashAt = 0
    this.contextSecondsWhenStarted = 0
  }
}

const TrackPreviewHandleSize = 8

const TrackPreviewLineSize = 2

const minMax = (value: number, max: number = 1, min: number = 0): number => {
  return Math.min(max, Math.max(min, value))
}

const sizeTranslate = (size: Size, translate: Size, negate = false): Size => {
  const { width, height } = size
  const negator = negate ? -1 : 1
  return {
    width: width + translate.width * negator,
    height: height + translate.height * negator
  }
}

/**
 * MashPreview of a single track at a single frame, thus representing a single clip 
 */
class ClientSegmentDescriptionClass implements ClientSegmentDescription {
  constructor(public args: ClientSegmentDescriptionArgs) {
    this.handleDownPoint = this.handleDownPoint.bind(this)
    this.handleDownSize = this.handleDownSize.bind(this)
    this.handleMovePoint = this.handleMovePoint.bind(this)
    this.handleMoveSize = this.handleMoveSize.bind(this)
    this.handleUp = this.handleUp.bind(this)
  }
  
  private addPointerDownListenerPoint(item: SvgItem): void {
    const handler = this.handleDownPoint
    item.addEventListener('pointerdown', handler, { once: true })
  }

  get clip(): ClientClip { return this.args.clip }

  private _clipTimeRange?: TimeRange
  private get clipTimeRange() { return this._clipTimeRange ||= this.clip.timeRange }

  private get container(): ClientInstance & ContainerInstance { return this.clip.container! }

  private containerScalarsDefined(keys: Strings): boolean {
    const { container } = this
    return keys.some(key => isDefined(container.value(key)))
  }

  private get cropDirections(): SideDirectionRecord {
    const { pointFlipping: flipped } = ClientSegmentDescriptionClass.doing!
    const { container } = this
    return { 
      [$LEFT]: container.value(`${flipped ? $TOP : $LEFT}${$CROP}`), 
      [$RIGHT]: container.value(`${flipped ? $BOTTOM : $RIGHT}${$CROP}`), 
      [$TOP]: container.value(`${flipped ? $LEFT : $TOP}${$CROP}`), 
      [$BOTTOM]: container.value(`${flipped ? $RIGHT : $BOTTOM}${$CROP}`)
    }
  }

  private flipped(pointOrSize: PointOrSize): boolean {
    const { previewRect } = this
    if (previewRect.height < previewRect.width) return false

    return this.container.value(`${pointOrSize}${$ASPECT}`) === $FLIP
  }

  private handleDownPoint(event: Event) {
    if (!(event instanceof PointerEvent)) errorThrow(ERROR.Internal)

    eventStop(event)
    const point = { x: event.clientX, y: event.clientY }
    const { previewRect, rect, handleMovePoint, handleUp } = this

    // localize point to container rect
    const previewPoint = translatePoint(point, previewRect, true) 
    const offsetPoint = translatePoint(previewPoint, rect, true)

    const pointFlipping = this.flipped($POINT)
    const pointKeys = this.keys(pointFlipping, ...POINT_KEYS)
    const pointTweening = this.containerScalarsDefined(pointKeys.slice(0, 2)) 
    const jumpFrame = this.jumpFrame(pointTweening)
    const moveHandler = isPositive(jumpFrame) ? this.jump(jumpFrame) : handleMovePoint
    const clickedNumbers = this.numberRecord(pointKeys)
    ClientSegmentDescriptionClass.pointing = {
      clickedNumbers, 
      offsetPoint, pointFlipping: pointFlipping, pointTweening, moveHandler
    }
    this.selectClip()
    globalThis.window.addEventListener('pointermove', moveHandler)
    globalThis.window.addEventListener('pointerup', handleUp, { once: true })
  }

  private handleDownSize(event: Event) {
    if (!(event instanceof PointerEvent)) errorThrow(ERROR.Internal)

    eventStop(event)
    const { target } = event
    assertDatasetElement(target)

    const { direction } = target.dataset
    assertDefined(direction)
    
    const clientRect = target.getBoundingClientRect()
    const offset = translatePoint(event, clientRect, true)

    const { rect: clickedRect, previewRect, handleMoveSize, handleUp } = this
    const pointFlipping = this.flipped($POINT)
    const pointKeys = this.keys(pointFlipping, ...POINT_KEYS)
    const pointTweening = this.containerScalarsDefined(pointKeys.slice(0, 2)) 
    const sizeFlipping = this.flipped($SIZE)
    const sizeKeys = this.keys(sizeFlipping, ...SIZE_KEYS)
    const sizeTweening = this.containerScalarsDefined(sizeKeys.slice(0, 2)) 
        
    // localize point to preview rect
    const point = roundPoint({ x: event.clientX, y: event.clientY }, $ROUND)
    const clickedPreviewPoint = translatePoint(point, previewRect, true) 

    const allKeys = [...pointKeys, ...sizeKeys]
    const clickedNumbers = this.numberRecord(allKeys)

    const jumpFrame = this.jumpFrame(pointTweening || sizeTweening)
    const moveHandler = isPositive(jumpFrame) ? this.jump(jumpFrame) : handleMoveSize

    // clicked point is center of handle
    const halfHandle = TrackPreviewHandleSize / 2
    const { x, y } = offset
    const offsetPoint = { x: halfHandle - x,  y: halfHandle - y }
    
    ClientSegmentDescriptionClass.sizing = {
      clickedPreviewPoint, clickedNumbers, clickedRect, direction, 
      moveHandler, offsetPoint, pointTweening, pointFlipping, 
      sizeFlipping, sizeTweening,
    }
    globalThis.window.addEventListener('pointermove', moveHandler)
    globalThis.window.addEventListener('pointerup', handleUp, { once: true })
  }

  private handleMovePoint(event: PointerEvent): void {
    eventStop(event)
    const point = { x: event.clientX, y: event.clientY }
    const eventPoint = roundPoint(this.pointEvent(point), $ROUND)
    const scalarsById = this.pointScalars(eventPoint)
    // console.log(this.constructor.name, 'handleMovePoint', scalarsById)
    MOVIE_MASHER.dispatchCustom(new EventChangeScalars(scalarsById))
  }

  private handleMoveSize(event: PointerEvent) {
    eventStop(event)

    const { previewRect, cropDirections: crops, container } = this
    const { left, right, top, bottom } = crops
    const point = roundPoint({ x: event.clientX, y: event.clientY }, $ROUND)

    // constrain to preview rect unless crop is enabled for that side
    if (!left) point.x = Math.max(point.x, previewRect.x)
    if (!right) point.x = Math.min(point.x, previewRect.x + previewRect.width)
    if (!top) point.y = Math.max(point.y, previewRect.y)
    if (!bottom) point.y = Math.min(point.y, previewRect.y + previewRect.height)

    const { sizing } = ClientSegmentDescriptionClass
    assertDefined(sizing)
    
    const { clickedRect, clickedPreviewPoint, direction, sizeTweening, sizeFlipping, clickedNumbers } = sizing
    const eventPoint = this.pointEvent(point) 
    const deltaPoint = translatePoint(eventPoint, clickedPreviewPoint, true)

    const sizeValues = {
      width: deltaPoint.x / previewRect.width,
      height: deltaPoint.y / previewRect.height,
    }
 
    const [horzId, vertId] = this.ids(sizeFlipping, sizeTweening, ...SIZE_KEYS)
    
    const sizingHorz = direction.includes($LEFT) || direction.includes($RIGHT)
    const sizingVert = direction.includes($TOP) || direction.includes($BOTTOM)
    const sizingLeft = direction.includes($LEFT)
    const sizingTop = direction.includes($TOP)
    const corner = direction.includes(DASH)
    if (sizingLeft) sizeValues.width *= -1
    if (sizingTop) sizeValues.height *= -1
    if (!corner) {
      sizeValues.width *= 2
      sizeValues.height *= 2
    }

    const horz = minMax(clickedNumbers[horzId] + (sizingHorz ? sizeValues.width : 0))
    const vert = minMax(clickedNumbers[vertId] + (sizingVert ? sizeValues.height : 0))

    if (sizingHorz) container.setValue(horzId, horz)
    if (sizingVert) container.setValue(vertId, vert)

    const { rectInitialize: newRect } = this
    const pointPoint = copyPoint(clickedRect)
  
    if (sizingTop) pointPoint.y = eventPoint.y
    if (sizingLeft) pointPoint.x = eventPoint.x
    
    if (!corner) {
      if (!sizingLeft) pointPoint.x -= Math.round((newRect.width - clickedRect.width) / 2)
      if (!sizingTop) pointPoint.y -= Math.round((newRect.height - clickedRect.height) / 2)
    }

    if (sizingTop) {
      pointPoint.y = Math.min(pointPoint.y, clickedRect.y + clickedRect.height)
    }
    if (sizingLeft) { 
      pointPoint.x = Math.min(pointPoint.x, clickedRect.x + clickedRect.width)
    }
    
    const scalarsById: ScalarsById = this.pointScalars(pointPoint, newRect, crops)
    if (sizingHorz) scalarsById[horzId] = horz
    if (sizingVert) scalarsById[vertId] = vert
  
    // console.log(this.constructor.name, 'handleMoveSize', scalarsById)
    MOVIE_MASHER.dispatchCustom(new EventChangeScalars(scalarsById))
  }

  private handleUp(event: Event) {
    eventStop(event)
    console.log(this.constructor.name, 'handleUp')

    globalThis.window.removeEventListener('pointerup', this.handleUp)
    const { doing } = ClientSegmentDescriptionClass
    if (!doing) return

    delete ClientSegmentDescriptionClass.sizing
    delete ClientSegmentDescriptionClass.pointing
    doing.moved = false
    const { moveHandler } = doing
    globalThis.window.removeEventListener('pointermove', moveHandler)
  }

  private ids(flipped: boolean, tweening: boolean, ...keys: Strings): PropertyIds {
    const [horzEndKey, vertEndKey, horzKey, vertKey] = this.keys(flipped, ...keys)
    const { time, clipTimeRange } = this    
    const tween = tweening && time.frame === clipTimeRange.lastTime.frame
    return [
      `${$CONTAINER}${DOT}${tween ? horzEndKey : horzKey}`,
      `${$CONTAINER}${DOT}${tween ? vertEndKey : vertKey}`,
    ] 
  }

  private jump(frame: number) {
    return (event: Event) => { 
      // console.log(this.constructor.name, 'jump', frame)
      this.handleUp(event)
      MOVIE_MASHER.dispatchCustom(new EventChangeFrame(frame)) 
    }
  }
  
  private jumpFrame(tweening: boolean): number | undefined {
    if (tweening) {
      const { time } = this
      const closest = time.closest(this.clipTimeRange)
      if (!time.equalsTime(closest)) return closest.frame
    }
    return undefined
  }

  private keys(flipped: boolean, ...keys: Strings): Strings {
    const [horzKey, vertKey] = flipped ? [...keys].reverse() : keys
    const horzEndKey = `${horzKey}${$END}`
    const vertEndKey = `${vertKey}${$END}`
    return [horzEndKey, vertEndKey, horzKey, vertKey]
  }

  private numberRecord(keys: Strings): NumberRecord {
    const { container } = this
    return  Object.fromEntries(keys.flatMap(key => {
      const value = container.value(key)
      if (!isNumber(value)) return []

      return [[[$CONTAINER, key].join(DOT), value]]
    }))
  }

  private pointEvent(point: Point): Point {
    const { doing } = ClientSegmentDescriptionClass
    const { offsetPoint } = doing! 
    const { previewRect } = this

    // localize point to preview rect
    const previewPoint = translatePoint(point, previewRect, true)
    
    // remove any offset from the down point
    return translatePoint(previewPoint, offsetPoint, true)
  }

  private pointScalars(eventPoint: Point, size?: Size, cropDirections?: SideDirectionRecord): ScalarsById {    
    const crops = cropDirections || this.cropDirections
    const rect = size || this.rect
    const { doing } = ClientSegmentDescriptionClass
    assertDefined(doing)

    doing.moved = true
    const { pointTweening, pointFlipping, clickedNumbers } = doing
    const [horzId, vertId] = this.ids(pointFlipping, pointTweening, ...POINT_KEYS)
    const { previewRect } = this
    const { left, right, top, bottom } = crops
    const { width: containerWidth, height: containerHeight } = rect

    // with no cropping, view is preview minus size of container
    const viewSize = sizeTranslate(previewRect, rect, true)

    // localize mouse point to preview rect and remove offset from down point
    
    const zeroPoint = { ...POINT_ZERO }
    if (top) { 
      zeroPoint.y -= containerHeight
      viewSize.height += containerHeight
    }
    if (left) {
      zeroPoint.x -= containerWidth
      viewSize.width += containerWidth
    }
    if (bottom) viewSize.height += containerHeight
    if (right) viewSize.width += containerWidth

    const offset = translatePoint(eventPoint, zeroPoint, true)

    const doingHorz = true
    const doingVert = true
    
    const scalarsById: ScalarsById = { 
      [horzId]: clickedNumbers[horzId], [vertId]: clickedNumbers[vertId], 
    }
    const { width, height } = viewSize

    if (doingHorz) scalarsById[horzId] = width ? minMax(offset.x / width) : 0
    if (doingVert) scalarsById[vertId] = height ? minMax(offset.y / height) : 0
    
    return scalarsById
  }

  private get preview() { return this.args.mashDescription }

  private _previewRect?: Rect
  private get previewRect() { 
    if (this._previewRect) return this._previewRect 
    
    const event = new EventRect()
    MOVIE_MASHER.dispatchCustom(event)
    const { rect } = event.detail
    assertRect(rect)
    return this._previewRect = rect
  }

  private _rect?: Rect
  private get rect() { return this._rect || this.rectInitialize }
  private get rectInitialize() {
    const { time, clipTimeRange: timeRange, clip, outputSize } = this
    assertSizeNotZero(outputSize, `${this.constructor.name}.rectInitialize size`)

    const containerRectArgs: ContainerRectArgs = { outputSize, time, timeRange }
    const [containerRect] = clip.clipRects(containerRectArgs)
    return containerRect
  }
  
  private selectClip(): void {
    MOVIE_MASHER.dispatch(EventChangeClipId.Type, this.clip.id)
  }

  private get outputSize(): Size { return this.preview.size }

  private svgHandlePoint(dimensions: Size, direction: Direction): Point {
    const handle = TrackPreviewHandleSize
    const halfHandle = handle / 2

    const { width, height } = dimensions
    const point = { ...POINT_ZERO }
    const [first, second] = String(direction).split(DASH)
    const last = second || first
    switch(last) {
      case $LEFT:
        point.x = - halfHandle
        break
      case $RIGHT:
        point.x = width - halfHandle
        break
      default: point.x = Math.round(width / 2) - halfHandle
    }
    switch(first) {
      case $TOP:
        point.y = - halfHandle
        break
      case $BOTTOM: 
        point.y = height - halfHandle
        break
      default: point.y = Math.round(height / 2) - halfHandle
    }
    return point
  }

  svgItem(animate: boolean): SvgItem {
    const classes: Strings = []
    classes.push(OUTLINE)
    if (animate) classes.push(ANIMATE)

    const { container, rect } = this
    const { type, source } = container.asset

    const vector = container.svgVector(rect, 'transparent')
    vector.setAttribute('vector-effect', 'non-scaling-stroke')
    if (type === $IMAGE && source === $TEXT) {
      const polygon = svgPolygonElement(rect, OUTLINE)
      const group = svgGroupElement()
      this.addPointerDownListenerPoint(polygon)
      svgAddClass(vector, ANIMATE)
      return svgAppend(group, [polygon, vector])
    } 
    svgAddClass(vector, classes)
    this.addPointerDownListenerPoint(vector)
    return vector
  }

  svgItems(lineClasses: string[], handleClasses: string[], inactive?: boolean): SvgItems {
    const items: SvgItems = []
    const corner = TrackPreviewHandleSize
    const line = TrackPreviewLineSize 
    const halfLine = line / 2
    const { rect, container } = this
    const directions = (() => {
      switch (container.sizeKey) {
        case $WIDTH: return [$LEFT, $RIGHT]
        case $HEIGHT: return [$TOP, $BOTTOM]
      }
      return DIRECTIONS_ALL
    })()
    // console.log(this.constructor.name, 'svgItems', directions)
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
      const rect = { x: x + point.x, y: y + point.y, width: corner, height: corner }
      const element = svgPolygonElement(rect, [...handleClasses, direction.toLowerCase()])
      items.push(element)
      if (inactive) return 

      element.dataset.direction = direction
      element.addEventListener('pointerdown', this.handleDownSize, { once: true })
    })
    return items
  }

  private get time(): Time { return this.preview.time }

  static get doing(): Doing | undefined {
    return ClientSegmentDescriptionClass.sizing || ClientSegmentDescriptionClass.pointing
  }
  
  private static pointing?: Pointing

  private static sizing?: Sizing
}

/**
 * MashPreview of a single mash at a single frame
 */
class ClientMashDescriptionClass extends MashDescriptionClass implements ClientMashDescription {
  constructor(protected override args: ClientMashDescriptionArgs) {
    super(args)
  }

  private editElements(items: SvgItems): SvgItems {
    if (!items.length) return items
    
    items.forEach(item => { svgAddClass(item, LAYER) })
    const copy = [...items]
    const { size, selectedClip } = this
    const { trackPreviews } = this
    const moved = ClientSegmentDescriptionClass.doing?.moved
    const selectedPreview = selectedClip ? trackPreviews.find(preview => preview.clip === selectedClip) : undefined
    const hoverItems: SvgItems = trackPreviews.map(trackPreview => {
      const trackSelected = trackPreview === selectedPreview
      return trackPreview.svgItem(!(moved || trackSelected))
    })
    const hoversSvg = svgSvgElement(size, hoverItems)
    svgAddClass(hoversSvg, OUTLINES)

    copy.push(hoversSvg)
    if (!selectedPreview) return copy
    
    const lineClasses = [LINE]
    const handleClasses = [HANDLE]
    const activeSvg = svgSvgElement(size, selectedPreview.svgItems(lineClasses, handleClasses, true))
    svgAddClass(activeSvg, [BOUNDS, BACK])
    
    const passiveSvg = svgSvgElement(size, selectedPreview.svgItems(lineClasses, handleClasses))
    svgAddClass(passiveSvg, [BOUNDS, FORE])
    copy.push(activeSvg, passiveSvg)
    return copy
  }

  protected override get clip(): ClientClip | undefined {
    return super.clip as ClientClip | undefined
  }
  protected override get clips(): ClientClips {
    return super.clips as ClientClips
  }

  private _elementsData?: DataOrError<SvgItems>

  get elementsPromise(): Promise<SvgItems> { 

    const { _elementsData } = this
    if (_elementsData) {
      if (isDefiniteError(_elementsData)) return Promise.resolve([])

      // console.log(this.constructor.name, 'elementsPromise', 'using cached data', _elementsData.data.length)
      return Promise.resolve(_elementsData.data)
    }
  
    const sizePromise = this.intrinsicSizePromise  
    const promise = sizePromise.then(() => {
      const { clips, size, time, clip } = this
      let promise = Promise.resolve([] as SvgItems)
      const component = clip ? $TIMELINE : $PLAYER
      // console.log(this.constructor.name, 'elementsPromise', clips.length, { component })
      clips.forEach(clip => {
        promise = promise.then(elements => {
          return clip.elementPromise(size, time, component).then(orError => {
            if (isDefiniteError(orError)) return elements
            
            // console.log(this.constructor.name, 'elementsPromise elementPromise')
            const element = simplifyRecord(orError.data, size)
            return [...elements, element] 
          })
        })
      })
      return promise 
    })
  
    return promise.then(items => {
      const { clip } = this
      const elements: SvgItems = []
      if (clip) elements.push(...items)
      else elements.push(...this.editElements(items)) 
      this._elementsData = { data: elements }
      return elements
    })
  }

  private get intrinsicSizePromise(): Promise<void> {
    const { clips, time, quantize } = this
    const args: InstanceCacheArgs = {
      quantize, visible: true, time, clipTime: timeRangeFromTime(time)
    }
    const promises = clips.map(clip => {
      args.clipTime = clip.timeRange
      return clip.clipCachePromise(args)
    })
    return Promise.all(promises).then(VOID_FUNCTION)
  }

  override get mash(): ClientMashAsset { return this.args.mash }

  get selectedClip(): Clip | undefined { return this.args.selectedClip }

  get svgItemsPromise(): Promise<SvgItems> { 
    return this.elementsPromise as Promise<SvgItems>
  }

  private _trackPreviews?: ClientSegmentDescriptions
  private get trackPreviews() { 
    return this._trackPreviews ||= this.clips.map(clip => 
      new ClientSegmentDescriptionClass({ clip, mashDescription: this })
    )
  }
}

class NonePreview extends ClientMashDescriptionClass {
  protected override get clips(): ClientClips { return [] }
}

export const VIEW_IDS = [$NONE, $MASH, $AUDIO]

export const mashViewFunction: SyncFunction<ClientMashDescription, ClientMashDescriptionArgs> = args => {
  assertDefined(args)
  return new ClientMashDescriptionClass(args)
}

export const noneViewFunction: SyncFunction<ClientMashDescription, ClientMashDescriptionArgs> = args => {
  assertDefined(args)
  return new NonePreview(args)
}

export const audioViewFunction: SyncFunction<AudioPreview, AudioPreviewArgs> = args => {
  return new AudioPreviewClass(args)
}
