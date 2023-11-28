import type { Asset, AssetCacheArgs, Clip, ContainerRectArgs, ContentRectArgs, DataOrError, Instance, InstanceArgs, InstanceCacheArgs, InstanceObject, IntrinsicOptions, Lock, NumberRecord, Point, Points, PopulatedString, PropertySize, Rect, RectTuple, Scalar, SideDirectionRecord, Size, Sizes, Strings, Time, TimeRange, UnknownRecord } from '@moviemasher/runtime-shared'

import { ASPECT, ASPECTS, ASSET_DURATION, AUDIO, BOOLEAN, CROP, DEFAULT_CONTAINER_ID, DEFAULT_CONTENT_ID, DIRECTIONS_ALL, DIRECTIONS_SIDE, END, FLIP, HEIGHT, LOCKS, LONGEST, NONE, PERCENT, RECT_ZERO, SHORTEST, STRING, WIDTH, isDefined, isNumber, isObject, isUndefined } from '@moviemasher/runtime-shared'
import { colorMixRbg, colorMixRbga, colorRgbToHex, colorRgbaToHex, colorToRgb, colorToRgba, colorValidHex } from '../utility/color.js'
import { isTimeRange, timeFromArgs } from '../utility/time.js'
import { assertAboveZero, assertDefined, assertNumber, assertPopulatedString, assertPositive, assertString, assertTrue, isPositive } from '../utility/guards.js'
import { idGenerateString } from '@moviemasher/runtime-shared'
import { pointCopy, pointFlip } from '../utility/rect.js'
import { rectFromSize } from '../utility/rect.js'
import { sizeAboveZero, sizeCeil, sizeCopy, sizeCover, sizeFlip, sizeScale } from '../utility/rect.js'
import { PropertiedClass } from './propertied.js'

const tweenNumberStep = (number: number, numberEnd: number, frame: number, frames: number): number => {
  const unit = (numberEnd - number) / frames
  return number + (unit * frame)
}

const tweenColorStep = (value: PopulatedString, valueEnd: PopulatedString, frame: number, frames: number): string => {
  assertString(value)
  assertString(valueEnd)
  const offset = frame / frames
  assertTrue(colorValidHex(value))
  if (value.length === 7 || value.length === 4) {
    const result = colorRgbToHex(colorMixRbg(colorToRgb(value), colorToRgb(valueEnd), offset))
    return result
  }
  return colorRgbaToHex(colorMixRbga(colorToRgba(value), colorToRgba(valueEnd), offset))
}

const numberRecord = (object: any): NumberRecord => {
  if (!isObject(object)) return {}
  const entries = Object.entries(object).filter(([_, value]) => isNumber(value)) 
  return Object.fromEntries(entries) as NumberRecord
}

const tweenCoverSize = (intrinsicSize: Size, containerSize: Size, scale: Size): Size => {
  const unscaledSize = sizeCover(intrinsicSize, containerSize)
  const { width, height } = scale
  const scaledSize = sizeScale(unscaledSize, width, height)
  return sizeCeil(scaledSize)
}

const tweenCoverPoint = (coverSize: Size, rect: Size, scale: Point): Point => {
  const { x, y } = scale
  const point: Point = {
    x: x * (coverSize.width - rect.width),
    y: y * (coverSize.height - rect.height),
  }
  return point
}

/**
 * @internal
 */
export const tweenPad = (outputDistance: number, scaledDistance: number, scale: number, leftCrop = false, rightCrop = false): number => {
  assertPositive(scale)
  assertPositive(scaledDistance)

  const baseDistance = outputDistance - scaledDistance
  const east = leftCrop ? scaledDistance: 0 
  const west = rightCrop ? scaledDistance : 0
  const distance = baseDistance + east + west
  const scaled = distance * scale
  const x = scaled - east
  return x
}

/**
 * @internal
 */
export const tweenScaleSizeToRect = (size: Size, scaleRect: Rect, directions: SideDirectionRecord = {}): Rect => {
  const { width: outWidth, height: outHeight } = size
  const { x, y, width, height } = scaleRect
  assertPositive(x, 'x')
  assertPositive(y, 'y')
  assertPositive(width, WIDTH)
  assertPositive(height, HEIGHT)

  const scaledSize = sizeScale(size, width, height)
  const evenSize = sizeCeil(scaledSize)
  const result = {
    ...evenSize,
    x: Math.round(tweenPad(outWidth, evenSize.width, x, directions.left, directions.right)), 
    y: Math.round(tweenPad(outHeight, evenSize.height, y, directions.top, directions.bottom))
  }
  return result
}

/**
 * @internal
 */
export const tweenRectsContainer = (rects: RectTuple, intrinsicSize: Size, lock: Lock, previewSize: Size, directions: SideDirectionRecord, pointAspect: string, sizeAspect: string): RectTuple => {
  return rects.map(rect => 
    tweenRectContainer(rect, intrinsicSize, lock, previewSize, directions, pointAspect, sizeAspect)
  ) as RectTuple
}

const tweenScaleSizeRatioLock = (scale: Size, previewSize: Size, inRatio: number, lock: Lock, flipped: boolean): Size => {
  if (lock === NONE) return scale

  const { width: outWidth, height: outHeight } = previewSize
  const result = { ...scale }
  const forcedScale = { ...scale }
  forcedScale.width = ((outHeight * result.height) * inRatio) / outWidth
  forcedScale.height = ((outWidth * result.width) / inRatio) / outHeight
  switch(lock){
    case LONGEST: {
      if (flipped) result.width = forcedScale.width
      else result.height = forcedScale.height
      break
    }
    case SHORTEST: {
      if (flipped) result.height = forcedScale.height
      else result.width = forcedScale.width 
      break
    }
    case HEIGHT: {
      result.width = forcedScale.width
      break
    }
    case WIDTH: {
      result.height = forcedScale.height
      break
    }
  }
  return result
}

const lockScaleSize = (scaleSize: Size, lock: Lock, shortest: PropertySize): Size => {
  if (lock === NONE) return scaleSize

  const copy = sizeCopy(scaleSize)
  const longest = shortest === WIDTH ? HEIGHT : WIDTH
  switch (lock) {
    case HEIGHT: {
      copy.width = copy.height
      break
    }
    case WIDTH: {
      copy.height = copy.width
      break
    }
    case SHORTEST: {
      copy[longest] = copy[shortest]
      break
    }
    case LONGEST: {
      copy[shortest] = copy[longest]
      break
    }
  }
  return copy
}

const tweenRectContainer = (tweenRect: Rect, intrinsicSize: Size, lock: Lock, previewSize: Size, crops: SideDirectionRecord, pointAspect: string, sizeAspect: string): Rect => {
  const portrait = previewSize.width < previewSize.height
  const flippedPoint = pointAspect === FLIP 
  const flippedSize = sizeAspect === FLIP
  const shortest = portrait ? WIDTH : HEIGHT
  const flipSize = portrait && flippedSize
  const flipPoint = portrait && flippedPoint
  const tweenPoint = flipPoint ? pointFlip(tweenRect) : pointCopy(tweenRect)
  const tweenSize = flipSize ? sizeFlip(tweenRect) : sizeCopy(tweenRect)
  const directions = flipPoint ? sideDirectionRecordFlip(crops) : crops
  lockScaleSize(tweenRect, lock, shortest)
  const ratio = intrinsicSize.width / intrinsicSize.height
  const forcedScale = {
    ...tweenPoint, 
    ...tweenScaleSizeRatioLock(tweenSize, previewSize, ratio, lock, flipSize)
  }
  return tweenScaleSizeToRect(previewSize, forcedScale, directions)
}

const sideDirectionRecordFlip = (directions: SideDirectionRecord): SideDirectionRecord => {
  const { top, bottom, left, right } = directions
  return {
    top: left,
    bottom: right,
    left: top,
    right: bottom
  }
}

export class InstanceClass extends PropertiedClass implements Instance {
  constructor(object: InstanceArgs) {
    super(object)
    const { asset, container } = object
    this.asset = asset 
    if (container) this.container = true
  }

  declare asset: Asset
  
  get assetId(): string { return this.asset.id }

  get assetIds(): Strings {
    return [...this.asset.assetIds]
  }
  
  assetTime(mashTime : Time) : Time {
    const { timeRange:range } = this.clip

    const { fps: quantize, startTime, endTime } = range
    const scaledTime = mashTime.scaleToFps(quantize) // may have fps higher than quantize and time.fps
    const frame = Math.max(Math.min(scaledTime.frame, endTime.frame), startTime.frame)
    return scaledTime.withFrame(frame - startTime.frame)
  }
  
  private _clip?: Clip
  get clip() { return this._clip! }
  set clip(value: Clip) { this._clip = value }
  get clipped(): boolean { return !!this._clip }

  container = false

  containerRects(args: ContainerRectArgs, intrinsicRect: Rect): RectTuple {
    const { size: previewSize, time, timeRange } = args
    const { width: intrinsicWidth, height: intrinsicHeight } = intrinsicRect
    const intrinsicSize: Size = {
      width: intrinsicWidth || previewSize.width, 
      height: intrinsicHeight || previewSize.height
    }
    const tweenRects = this.tweenRects(time, timeRange)
    const { lock, pointAspect, sizeAspect } = this
    const { sideDirectionRecord } = this
    return tweenRectsContainer(tweenRects, intrinsicSize, lock, previewSize, sideDirectionRecord, pointAspect, sizeAspect)
  }
  
  contentRects(args: ContentRectArgs): RectTuple {
    const { containerRects, time, timeRange, editing, shortest } = args    
    
    const rectIntrinsic = this.intrinsicRect(editing)
    // if I have no intrinsic size (like color source), use the container rects
    if (!sizeAboveZero(rectIntrinsic)) return containerRects
    
    const { lock } = this
    const tweenRects = this.tweenRects(time, timeRange)
    
    const rects = tweenRects.map((tweenRect, index) => {
      const tweenPoint = pointCopy(tweenRect)
      const tweenSize = lockScaleSize(tweenRect, lock, shortest)
      const containerRect = containerRects[index]
      containerRect.x += rectIntrinsic.x
      containerRect.y += rectIntrinsic.y

      const size = tweenCoverSize(rectIntrinsic, containerRect, tweenSize)
      const point = tweenCoverPoint(size, containerRect, tweenPoint)
      return rectFromSize(size, point)
    }) as RectTuple
    // console.log(this.constructor.name, 'contentRects', rects)

    return rects
  }
  
  get directions() { return DIRECTIONS_ALL }
  
  frames(quantize: number): number {
    assertAboveZero(quantize, 'frames quantize') 

    return timeFromArgs(ASSET_DURATION, quantize).frame
  }

  hasIntrinsicSizing = false

  hasIntrinsicTiming = false

  declare height: number

  protected _id?: string
  get id(): string { return this._id ||= idGenerateString() }

  override initializeProperties(object: InstanceArgs): void {
    const { container, targetId } = this
    // console.log(this.constructor.name, 'initializeProperties', this.asset.label, { container, targetId })
    if (container) {
      DIRECTIONS_SIDE.forEach(direction => {
        this.properties.push(this.propertyInstance({
          targetId, name: `${direction}${CROP}`, 
          type: BOOLEAN, defaultValue: false, 
        }))
      })
      this.properties.push(this.propertyInstance({
        targetId, name: 'opacity', type: PERCENT, 
        defaultValue: 1.0, min: 0.0, max: 1.0, step: 0.01, tweens: true,
      }))       
      this.properties.push(this.propertyInstance({
        targetId, name: `opacity${END}`, 
        type: PERCENT, undefinedAllowed: true, tweens: true,
        min: 0.0, max: 1.0, step: 0.01,
      }))       
    } 
    if (container || !this.isDefaultOrAudio) {

      this.properties.push(this.propertyInstance({
        targetId, name: 'x', type: PERCENT, defaultValue: 0.5,
        min: 0.0, max: 1.0, step: 0.01, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId, name: `x${END}`, 
        type: PERCENT, undefinedAllowed: true, tweens: true,
        min: 0.0, max: 1.0, step: 0.01,
      }))
      this.properties.push(this.propertyInstance({
        targetId, name: 'y', type: PERCENT, defaultValue: 0.5,
        min: 0.0, max: 1.0, step: 0.01, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId, name: `y${END}`, 
        type: PERCENT, undefinedAllowed: true, tweens: true,
        min: 0.0, max: 1.0, step: 0.01,
      }))
      this.properties.push(this.propertyInstance({
        targetId, name: 'lock', type: STRING, 
        defaultValue: SHORTEST, options: LOCKS, 
      }))
      this.properties.push(this.propertyInstance({
        targetId, name: `point${ASPECT}`, type: STRING, 
        defaultValue: FLIP, options: ASPECTS, 
      }))
      this.properties.push(this.propertyInstance({
        targetId, name: `size${ASPECT}`, type: STRING, 
        defaultValue: FLIP, options: ASPECTS, 
      }))
    }
    super.initializeProperties(object)
  }

  instanceCachePromise(args: InstanceCacheArgs): Promise<DataOrError<number>> {
    const { time } = args
    const assetTime = this.assetTime(time)
    const options: AssetCacheArgs = { ...args, assetTime }
    // console.log(this.constructor.name, 'InstanceClass.instanceCachePromise', options, this.assetId)
    return this.asset.assetCachePromise(options)
  }

  get instanceObject(): InstanceObject {
    return this.scalarRecord
  }

  intrinsicRect(_ = false): Rect { return RECT_ZERO }

  intrinsicsKnown(options: IntrinsicOptions): boolean { return true }

  get isDefault() { 
    return [DEFAULT_CONTENT_ID, DEFAULT_CONTAINER_ID].includes(this.assetId) 
  }

  get isAudio() { return this.type === AUDIO }
  get isDefaultOrAudio() { return this.isDefault || this.isAudio }
  
  protected _label = ''
  get label(): string { return this._label  }
  set label(value: string) { this._label = value }

  declare lock: Lock

  mutable() { return false }
  
  declare muted: boolean 

  declare leftConstrain: boolean
  declare rightConstrain: boolean
  declare topConstrain: boolean
  declare bottomConstrain: boolean

  declare opacity: number
  opacityEnd?: number 

  declare pointAspect: string

  get sideDirectionRecord(): SideDirectionRecord {
    return Object.fromEntries(DIRECTIONS_SIDE.map(direction => {
      const key = `${direction}${CROP}`
      const value = this.value(key)
      return [direction, Boolean(value)]
    })) 
  }

  declare sizeAspect: string

  toJSON(): UnknownRecord {
    const { assetId, label } = this
    return { ...super.toJSON(), assetId, label }
  }

  private tween(keyPrefix: string, time: Time, range: TimeRange): Scalar {
    const value = this.value(keyPrefix)
    if (isUndefined(value)) {
      console.error(this.constructor.name, 'tween', keyPrefix, 'value undefined', this.properties.map(property => property.name))
    }
    assertDefined<Scalar>(value, keyPrefix)

    const valueEnd = this.value(`${keyPrefix}${END}`)
    if (isUndefined(valueEnd)) return value

    const { frame: rangeFrame, frames } = range
    const { frame: timeFrame } = time
    const frame = timeFrame - rangeFrame
    if (isNumber(value)) {
      assertNumber(valueEnd)
      return tweenNumberStep(value, valueEnd, frame, frames)
    }
    assertPopulatedString(value)
    assertPopulatedString(valueEnd)
    return tweenColorStep(value, valueEnd, frame, frames)
  }

  private tweenPoints(time: Time, range: TimeRange): Points {
    const [x, xEndOrNot] = this.tweenValues('x', time, range)
    const [y, yEndOrNot] = this.tweenValues('y', time, range)
    if (!(isPositive(x) && isPositive(y))) {
      console.error('InstanceClass.tweenPoints', { x, y }, time, range, this.value('x'), this.value('y'), this.value('xEnd'), this.value('yEnd'))
    }
    assertPositive(x, 'x')
    assertPositive(y, 'y')
    const point: Point = { x, y } 
    const points: Points = [point]
    if (isDefined(xEndOrNot) || isDefined(yEndOrNot)) {
      points.push({ ...point, ...numberRecord({ x: xEndOrNot, y: yEndOrNot }) })
    }
    return points
  }

  private tweenRects(time: Time, range: TimeRange): RectTuple {
    const [size, sizeEnd] = this.tweenSizes(time, range)
    const [point, pointEnd] = this.tweenPoints(time, range)
    const rect = { ...point , ...size }
    const rects: RectTuple = [ rect, rect ]
    if (isDefined(sizeEnd) || isDefined(pointEnd)) {
      rects[1] = { ...(pointEnd || point), ...(sizeEnd || size) }
    }
    return rects 
  }

  private tweenSizes(time: Time, range: TimeRange): Sizes {
    const [width, widthEndOrNot] = this.tweenValues(WIDTH, time, range)
    const [height, heightEndOrNot] = this.tweenValues(HEIGHT, time, range)
    assertNumber(width)
    assertNumber(height)
    const size: Size = { width, height } 
    const sizes: Sizes = [size]
    if (isDefined(widthEndOrNot) || isDefined(heightEndOrNot)) {
      const tweenSize = { width: widthEndOrNot, height: heightEndOrNot }
      sizes.push({ ...size, ...numberRecord(tweenSize) })
    }
    return sizes
  }

  tweenValues(key: string, time: Time, range: TimeRange): Scalar[] {
    const values: Scalar[] = []
    const isRange = isTimeRange(time)
    values.push(this.tween(key, isRange ? time.startTime : time, range))
    if (isRange) values.push(this.tween(key, time.endTime, range))
    return values
  }

  declare width: number

  declare x: number

  declare y: number
}
