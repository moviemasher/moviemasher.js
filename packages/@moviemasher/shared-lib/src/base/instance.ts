import type { Asset, AssetCacheArgs, Clip, ContainerRectArgs, ContentRectArgs, DataOrError, Instance, InstanceArgs, InstanceCacheArgs, InstanceObject, IntrinsicOptions, Lock, NumberRecord, Point, Points, PopulatedString, PropertySize, Rect, RectTuple, Scalar, SideDirectionRecord, Size, Sizes, StringIndexable, Strings, Time, TimeRange, UnknownRecord } from '../types.js'

import { CEIL, ASPECT, ASPECTS, ASSET_DURATION, AUDIO, BOOLEAN, CROP, DEFAULT_CONTAINER_ID, DEFAULT_CONTENT_ID, DIRECTIONS_SIDE, END, FLIP, HEIGHT, LOCKS, LONGEST, MAINTAIN, NONE, PERCENT, RECT_ZERO, SHORTEST, STRING, WIDTH, isDefined, isNumber, isObject, isUndefined, idGenerate } from '../runtime.js'
import { colorMixRbg, colorMixRbga, colorRgbToHex, colorRgbaToHex, colorToRgb, colorToRgba, colorValidHex } from '../utility/color.js'
import { isTimeRange, timeFromArgs } from '../utility/time.js'
import { assertAboveZero, assertDefined, assertNumber, assertPopulatedString, assertPositive, assertString, assertTrue, isPositive } from '../utility/guards.js'
import { pointCopy, pointFlip, pointTranslate, sideDirectionRecordFlip, sizeEven, sizeLock } from '../utility/rect.js'
import { sizeAboveZero, sizeCopy, sizeCover, sizeFlip, sizeScale } from '../utility/rect.js'
import { PropertiedClass } from './propertied.js'


// const tweenKeysStep = (keys: Strings, record: NumberRecord, recordEnd: NumberRecord, frame: number, frames: number): NumberRecord => {
//   const entries = keys.map(key => {
//     return [key, tweenNumberStep(record[key], recordEnd[key], frame, frames)]
//   })
//   const result = Object.fromEntries(entries) 
//   assertNumberRecord(result)
//   return result
// }


// const tweenRectStep = (rect: Rect, rectEnd: Rect, frame: number, frames: number): Rect => {
//   const size = numberRecord(rect, SIZE_KEYS)
//   const point = numberRecord(rect, POINT_KEYS)
//   const sizeEnd = numberRecord(rectEnd, SIZE_KEYS)
//   const pointEnd = numberRecord(rectEnd, POINT_KEYS)

//   const result = { 
//     ...tweenKeysStep(POINT_KEYS, point, pointEnd, frame, frames), 
//     ...tweenKeysStep(SIZE_KEYS, size, sizeEnd, frame, frames)
//   }
//   assertRect(result)
//   return result
// }

const tweenNumberStep = (number: number, numberEnd: number, frame: number, frames: number): number => {
  const unit = (numberEnd - number) / frames
  const result = number + (unit * frame)
  // console.log('tweenNumberStep', { number, numberEnd, frame, frames, unit, result })
  return result
}

const tweenColorStep = (value: PopulatedString, valueEnd: PopulatedString, frame: number, frames: number): string => {
  assertString(value)
  assertString(valueEnd)
  const offset = frame / frames
  assertTrue(colorValidHex(value))
  if (value.length === 7 || value.length === 4) {
    const result = colorRgbToHex(colorMixRbg(colorToRgb(value), colorToRgb(valueEnd), offset))
    // console.log('tweenColorStep', { frame, frames, offset })
    return result
  }
  const color = colorRgbaToHex(colorMixRbga(colorToRgba(value), colorToRgba(valueEnd), offset))
  return color
}

const numberRecord = (object: StringIndexable, keys?: Strings): NumberRecord => {
  if (!isObject(object)) return {}

  const props = keys || Object.keys(object)
  const entries = props.flatMap(prop => {
    const value = object[prop]
    if (!isNumber(value)) return []
    return [[prop, value]]
  })
   
  return Object.fromEntries(entries) as NumberRecord
}



/**
 * @internal
 */
export const pointPad = (outputDistance: number, inputDistance: number, scale: number, startCrop = false, endCrop = false): number => {
  assertPositive(scale)
  assertPositive(inputDistance)

  const baseDistance = outputDistance - inputDistance
  const east = startCrop ? inputDistance: 0 
  const west = endCrop ? inputDistance : 0
  const distance = baseDistance + east + west
  const scaled = distance * scale
  const x = scaled - east
  return x
}



// const containerRects = (scalingRects: RectTuple, intrinsicSize: Size, outputSize: Size, sideDirections: SideDirectionRecord, pointAspect: string, sizeAspect: string, propertySize?: PropertySize): RectTuple => {
//   return scalingRects.map(rect => {
//     // determind if point and/or size needs flipping
//     const outputtingPortrait = outputSize.width < outputSize.height
//     const sizeFlipping = outputtingPortrait && sizeAspect === FLIP
//     const pointFlipping = outputtingPortrait && pointAspect === FLIP 

//     // flip sideDirection, point and size if needed
//     const scalingPoint = pointFlipping ? pointFlip(rect) : pointCopy(rect)
//     const scalingSize = sizeFlipping ? sizeFlip(rect) : sizeCopy(rect)
//     if (propertySize) {
//       // lock other side to same aspect ratio as intrinsic
//       const other = propertySize === WIDTH ? HEIGHT : WIDTH
//       const ratio = intrinsicSize[other] / intrinsicSize[propertySize]
//       scalingSize[other] = ((outputSize[propertySize] * scalingSize[propertySize]) * ratio) / outputSize[other]
//     }
//     const directions = pointFlipping ? sideDirectionRecordFlip(sideDirections) : sideDirections
//     const scalingRect = { ...scalingPoint, ...scalingSize }
//     return tweenScaleSizeToRect(outputSize, scalingRect, directions)    
//   }) as RectTuple
// }

 

// const size = coverScaleSize(inRect, containerRect, tweenSize)

    // // note that inRect point gets scaled and translated here too...
      // const covered = sizeCover(sizeCopy(inRect), containerRect)
      // const sized = sizeScale(covered, tweenSize.width, tweenSize.height)

      // const size = sizeEven(sized, CEIL)
      // assertRect(size)

// const coverScalePoint = (coverSize: Size, size: Size, scale: Point): Point => {
//   const translated = sizeTranslate(coverSize, size, true)
//   return { x: scale.x * translated.width, y: scale.y * translated.height }
// }


const scaledContentSize = (inSize: Size, outSize: Size, scaleSize: Size): Size => {
  const scaledSize = sizeScale(sizeCover(inSize, outSize), scaleSize.width, scaleSize.height)
  return sizeEven(scaledSize, CEIL) 
}

const scaledContentPoint = (contentSize: Size, containerSize: Size, scalingPoint: Point): Point => {
  const invertedScalingPoint = {
    x: 1.0 - scalingPoint.x,
    y: 1.0 - scalingPoint.y,
  }
  const availableSize = {
    width: containerSize.width - contentSize.width,
    height: containerSize.height - contentSize.height,
  }
  return {
    x: invertedScalingPoint.x * availableSize.width,
    y: invertedScalingPoint.y * availableSize.height,
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
  
  assetTime(mashTime: Time) : Time {
    const { timeRange: clipTimeRange } = this.clip
    const { fps, startTime, endTime } = clipTimeRange
    const scaledTime = mashTime.scaleToFps(fps) // may have fps higher than quantize and time.fps
    const frame = Math.max(Math.min(scaledTime.frame, endTime.frame), startTime.frame)
    return scaledTime.withFrame(frame - startTime.frame)
  }
  
  private _clip?: Clip
  get clip() { return this._clip! }
  set clip(value: Clip) { this._clip = value }
  get clipped(): boolean { return !!this._clip }

  container = false

  containerRects(args: ContainerRectArgs, intrinsicSize: Size): RectTuple {
    const { size: outputSize, time, timeRange } = args
    const containerScalingRects = this.scaleRects(time, timeRange)
    const { pointAspect, sizeAspect, propertySize, sideDirectionRecord: sideDirections } = this
    const outputtingPortrait = outputSize.width < outputSize.height
    const sizeFlipping = outputtingPortrait && sizeAspect === FLIP
    const pointFlipping = outputtingPortrait && pointAspect === FLIP 
    const directions = pointFlipping ? sideDirectionRecordFlip(sideDirections) : sideDirections

    const containerSizes: Size[] = containerScalingRects.map(rect => {
      const containerScalingSize: Size = sizeFlipping ? sizeFlip(rect) : sizeCopy(rect)
      if (propertySize) {
        // lock other side to same aspect ratio as intrinsic
        const other = propertySize === WIDTH ? HEIGHT : WIDTH
        const ratio = intrinsicSize[other] / intrinsicSize[propertySize]
        containerScalingSize[other] = ((outputSize[propertySize] * containerScalingSize[propertySize]) * ratio) / outputSize[other]
      }
      const containerScaledSize = sizeScale(outputSize, containerScalingSize.width, containerScalingSize.height)
      return sizeEven(containerScaledSize, CEIL) 
    })

    const containerRects = containerScalingRects.map((scalingRect, index) => {
      const containerScalingPoint = pointFlipping ? pointFlip(scalingRect) : pointCopy(scalingRect)
      const containerSize = containerSizes[index]
      const { left, right, top, bottom } = directions
      const containerPoint = {
        x: pointPad(outputSize.width, containerSize.width, containerScalingPoint.x, left, right), 
        y: pointPad(outputSize.height, containerSize.height, containerScalingPoint.y, top, bottom)
      }
      const rect: Rect = { ...containerSize, ...containerPoint }
      return rect
    }) as RectTuple
    return containerRects
  }
  
  
  contentRects(args: ContentRectArgs): RectTuple {
    const { containerRects, time, timeRange } = args    
    const inRect = this.intrinsicRect

    // console.log(this.constructor.name, 'contentRects', { inRect })
    // if I have no intrinsic size (like color source), use the container rects
    if (!sizeAboveZero(inRect)) return containerRects
    
    const { propertySize } = this
    return this.scaleRects(time, timeRange).map((contentScalingRect, index) => {
      const containerRect = containerRects[index]
      const containerPoint = pointCopy(containerRect)
      const containerSize = sizeCopy(containerRect)
      
      // determine content size
      const contentScalingSize = sizeLock(contentScalingRect, propertySize)
      const contentSize = scaledContentSize(sizeCopy(inRect), containerSize, contentScalingSize)

      // determine content point 
      const contentScalingPoint = pointCopy(contentScalingRect)
      const contentPoint = scaledContentPoint(contentSize, containerSize, contentScalingPoint)
      
      return { 
        ...contentSize, 
        ...pointTranslate(containerPoint, contentPoint) 
      }

    }) as RectTuple
  }
  
  frames(quantize: number): number {
    assertAboveZero(quantize, 'frames quantize') 

    return timeFromArgs(ASSET_DURATION, quantize).frame
  }

  hasIntrinsicSizing = false

  hasIntrinsicTiming = false

  declare height: number

  protected _id?: string
  get id(): string { return this._id ||= idGenerate(this.label || this.asset.label || this.asset.id) }

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
        defaultValue: MAINTAIN, options: ASPECTS, 
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
    return this.asset.assetCachePromise(options)
  }

  get instanceObject(): InstanceObject {
    return this.scalarRecord
  }

  get intrinsicRect(): Rect { return RECT_ZERO }

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

  get canBeMuted() { return false }
  
  declare muted: boolean 

  declare leftConstrain: boolean
  declare rightConstrain: boolean
  declare topConstrain: boolean
  declare bottomConstrain: boolean

  declare opacity: number
  opacityEnd?: number 

  declare pointAspect: string

  get propertySize(): PropertySize | undefined {
    const { lock } = this
    switch (lock) {
      case NONE: return
      case WIDTH: 
      case HEIGHT: return lock
    }
    const size = this.intrinsicRect
    const portrait = size.width < size.height
    
    switch (lock) {
      case SHORTEST: return portrait ? WIDTH : HEIGHT
      case LONGEST: return portrait ? HEIGHT : WIDTH
    }
  }

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

  private scalePoints(time: Time, range: TimeRange): Points {
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

  scaleRects(time: Time, range: TimeRange): RectTuple {
    const [size, sizeEnd] = this.scaleSizes(time, range)
    const [point, pointEnd] = this.scalePoints(time, range)
    const rect = { ...point , ...size }
    const rects: RectTuple = [ rect, rect ]
    if (isDefined(sizeEnd) || isDefined(pointEnd)) {
      rects[1] = { ...(pointEnd || point), ...(sizeEnd || size) }
    }
    return rects 
  }

  private scaleSizes(time: Time, range: TimeRange): Sizes {
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

  private tweenValue(keyPrefix: string, time: Time, range: TimeRange): Scalar {
    const value = this.value(keyPrefix)
    if (isUndefined(value)) {
      console.error(this.constructor.name, 'tween', keyPrefix, 'value undefined', this.properties.map(property => property.name))
    }
    assertDefined<Scalar>(value, keyPrefix)

    const valueEnd = this.value(`${keyPrefix}${END}`)
    if (isUndefined(valueEnd)) return value

    const { seconds: rangeSeconds, lengthSeconds } = range
    const { seconds: timeSeconds } = time
    const offset = timeSeconds - rangeSeconds
    if (isNumber(value)) {
      assertNumber(valueEnd)
      return tweenNumberStep(value, valueEnd, offset, lengthSeconds)
    }
    assertPopulatedString(value)
    assertPopulatedString(valueEnd)
    // console.log(this.constructor.name, 'tween COLOR', { time, range, rangeSeconds, lengthSeconds, timeSeconds, offset  })
    return tweenColorStep(value, valueEnd, offset, lengthSeconds)
  }

  tweenValues(key: string, time: Time, range: TimeRange): Scalar[] {
    const values: Scalar[] = []
    const isRange = isTimeRange(time)
    values.push(this.tweenValue(key, isRange ? time.startTime : time, range))
    if (isRange) values.push(this.tweenValue(key, time.endTime, range))
    return values
  }

  declare width: number

  declare x: number

  declare y: number
}
