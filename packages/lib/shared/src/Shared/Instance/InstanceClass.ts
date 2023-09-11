import type { Asset, CacheOptions, Clip, ContainerRectArgs, ContentRectArgs, DataOrError, Instance, InstanceArgs, InstanceCacheArgs, InstanceObject, IntrinsicOptions, Lock, Point, Points, Rect, Rects, Scalar, SideDirectionRecord, Size, Sizes, Strings, Time, TimeRange, UnknownRecord } from '@moviemasher/runtime-shared'

import { Aspect, Crop, End, RECT_ZERO, AUDIO, isDefined, isNumber, isUndefined, } from '@moviemasher/runtime-shared'
import { PropertiedClass } from "../../Base/PropertiedClass.js"
import { DefaultContainerId } from '../../Helpers/Container/ContainerConstants.js'
import { DefaultContentId } from '../../Helpers/Content/ContentConstants.js'
import { timeFromArgs } from '../../Helpers/Time/TimeUtilities.js'
import { DataTypeBoolean, DataTypePercent, DataTypeString } from "../../Setup/DataTypeConstants.js"
import { Default } from '../../Setup/Default.js'
import { DIRECTIONS, DIRECTIONS_SIDE } from '../../Setup/DirectionConstants.js'
import { AspectFlip, Aspects, LockShortest, Locks } from '../../Setup/LockConstants.js'
import { propertyInstance } from "../../Setup/PropertyFunctions.js"
import { idGenerateString } from '../../Utility/IdFunctions.js'
import { sizeAboveZero, sizeCeil, sizeCover, sizeScale } from "../../Utility/SizeFunctions.js"
import { assertDefined, assertNumber, assertPopulatedString } from '../SharedGuards.js'
import { isTimeRange } from "../TimeGuards.js"
import { lockScaleSize, numberRecord, tweenColorStep, tweenNumberStep, tweenRectsContainer } from '../Utility/Tween/TweenFunctions.js'
import { pointCopy } from '../../Utility/PointFunctions.js'
import { rectFromSize } from '../../Utility/RectFunctions.js'



const tweenCoverSize = (intrinsicSize: Size, containerSize: Size, scale: Size): Size => {
  // const [size, sizeEnd] = sizes
  // const [scale, scaleEnd] = scales
  const unscaledSize = sizeCover(intrinsicSize, containerSize)
  const { width, height } = scale
  const scaledSize = sizeScale(unscaledSize, width, height)
  return sizeCeil(scaledSize)

  // const coverSizes: Sizes = [coverSize]
  // if (sizeEnd && scaleEnd) {
  //   const unscaledSizeEnd = sizeCover(inSize, sizeEnd)
  //   const { width: widthEnd, height: heightEnd } = scaleEnd
  //   const scaledSizeEnd = sizeScale(unscaledSizeEnd, widthEnd, heightEnd)
  //   const coverSizeEnd = sizeCeil(scaledSizeEnd)
  //   coverSizes.push(coverSizeEnd)
  // }
  // return coverSizes
}
const tweenCoverPoint = (coverSize: Size, rect: Size, scale: Point): Point => {
  const { x, y } = scale
  const point: Point = {
    x: x * (coverSize.width - rect.width),
    y: y * (coverSize.height - rect.height),
  }
  return point
  
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

  containerRects(args: ContainerRectArgs, intrinsicRect: Rect): Rects {
    const { size: previewSize, time, timeRange } = args
    const { width: intrinsicWidth, height: intrinsicHeight } = intrinsicRect

    const intrinsicSize = {
      ...intrinsicRect,
      width: intrinsicWidth || previewSize.width, 
      height: intrinsicHeight || previewSize.height
    }

    const tweenRects = this.tweenRects(time, timeRange)
    const { lock, pointAspect, sizeAspect } = this
    const { sideDirectionRecord } = this

    return tweenRectsContainer(tweenRects, intrinsicSize, lock, previewSize, sideDirectionRecord, pointAspect, sizeAspect)
  }
  
  contentRects(args: ContentRectArgs): Rects {
    const { containerRects, time, timeRange, editing, shortest } = args    
    
    const intrinsicRect = this.intrinsicRect(editing)
    // if I have no intrinsic size (like color source), use the container rects
    if (!sizeAboveZero(intrinsicRect)) return containerRects
    
    const { lock } = this
    const tweenRects = this.tweenRects(time, timeRange)
    
    return tweenRects.map((tweenRect, index) => {
      const tweenPoint = pointCopy(tweenRect)
      const tweenSize = lockScaleSize(tweenRect, lock, shortest)
      const containerRect = containerRects[index]
      const size = tweenCoverSize(intrinsicRect, containerRect, tweenSize)
      const point = tweenCoverPoint(size, containerRect, tweenPoint)
      return rectFromSize(size, point)
    })
  }
  
  get directions() { return DIRECTIONS }
  
  frames(quantize: number): number {
    return timeFromArgs(Default.duration, quantize).frame
  }

  hasIntrinsicSizing = false

  hasIntrinsicTiming = false

  declare height: number

  protected _id?: string
  get id(): string { return this._id ||= idGenerateString() }

  override initializeProperties(object: InstanceArgs): void {
    const { container, targetId } = this
  
    if (container) {
      DIRECTIONS_SIDE.forEach(direction => {
        this.properties.push(propertyInstance({
          targetId, name: `${direction}${Crop}`, 
          type: DataTypeBoolean, defaultValue: false, 
        }))
      })
      this.properties.push(propertyInstance({
        targetId, name: 'opacity', type: DataTypePercent, 
        defaultValue: 1.0, min: 0.0, max: 1.0, step: 0.01, tweens: true,
      }))       
      this.properties.push(propertyInstance({
        targetId, name: `opacity${End}`, 
        type: DataTypePercent, undefinedAllowed: true, tweens: true,
        min: 0.0, max: 1.0, step: 0.01,
      }))       
    } 
    if (container || !this.isDefaultOrAudio) {

      this.properties.push(propertyInstance({
        targetId, name: 'x', type: DataTypePercent, defaultValue: 0.5,
        min: 0.0, max: 1.0, step: 0.01, tweens: true,
      }))
      this.properties.push(propertyInstance({
        targetId, name: `x${End}`, 
        type: DataTypePercent, undefinedAllowed: true, tweens: true,
        min: 0.0, max: 1.0, step: 0.01,
      }))
      this.properties.push(propertyInstance({
        targetId, name: 'y', type: DataTypePercent, defaultValue: 0.5,
        min: 0.0, max: 1.0, step: 0.01, tweens: true,
      }))
      this.properties.push(propertyInstance({
        targetId, name: `y${End}`, 
        type: DataTypePercent, undefinedAllowed: true, tweens: true,
        min: 0.0, max: 1.0, step: 0.01,
      }))
      this.properties.push(propertyInstance({
        targetId, name: 'lock', type: DataTypeString, 
        defaultValue: LockShortest, options: Locks, 
      }))
      this.properties.push(propertyInstance({
        targetId, name: `point${Aspect}`, type: DataTypeString, 
        defaultValue: AspectFlip, options: Aspects, 
      }))
      this.properties.push(propertyInstance({
        targetId, name: `size${Aspect}`, type: DataTypeString, 
        defaultValue: AspectFlip, options: Aspects, 
      }))
    }
    super.initializeProperties(object)
  }

  instanceCachePromise(args: InstanceCacheArgs): Promise<DataOrError<number>> {
    const { time } = args
    const assetTime = this.assetTime(time)
    const options: CacheOptions = { ...args, time: assetTime }
    // console.log(this.constructor.name, 'InstanceClass.instanceCachePromise', options, this.assetId)
    return this.asset.assetCachePromise(options)
  }

  get instanceObject(): InstanceObject {
    return this.scalarRecord
  }

  intrinsicRect(_ = false): Rect { return RECT_ZERO }

  intrinsicsKnown(options: IntrinsicOptions): boolean { return true }

  get isDefault() { 
    return [DefaultContentId, DefaultContainerId].includes(this.assetId) 
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
    return Object.fromEntries(DIRECTIONS_SIDE.map(direction => 
      [direction, Boolean(this.value(`${direction}Crop`))]
    ))
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

    const valueEnd = this.value(`${keyPrefix}${End}`)
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
    assertNumber(x)
    assertNumber(y)
    const point: Point = { x, y } 
    const points: Points = [point]
    if (isDefined(xEndOrNot) || isDefined(yEndOrNot)) {
      points.push({ ...point, ...numberRecord({ x: xEndOrNot, y: yEndOrNot }) })
    }
    return points
  }

  private tweenRects(time: Time, range: TimeRange): Rects {
    const [size, sizeEnd] = this.tweenSizes(time, range)
    const [point, pointEnd] = this.tweenPoints(time, range)
    const rects: Rects = [ { ...point , ...size } ]
    if (isDefined(sizeEnd) || isDefined(pointEnd)) {
      rects.push({ ...(pointEnd || point) , ...(sizeEnd || size) })  
    }
    return rects
  }

  private tweenSizes(time: Time, range: TimeRange): Sizes {
    const [width, widthEndOrNot] = this.tweenValues('width', time, range)
    const [height, heightEndOrNot] = this.tweenValues('height', time, range)
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
