import type { Time, TimeRange, Point, PointTuple, Rect, RectTuple, Size, SizeTuple,  UnknownRecord, Scalar, Strings, Lock } from '@moviemasher/runtime-shared'
import { TypeAudio, } from '@moviemasher/runtime-shared'
import { Asset } from '@moviemasher/runtime-shared'
import { CacheOptions, InstanceCacheArgs } from "@moviemasher/runtime-shared"
import { PropertyTweenSuffix } from "../../Base/PropertiedConstants.js"
import { PropertiedClass } from "../../Base/PropertiedClass.js"
import { timeFromArgs } from '../../Helpers/Time/TimeUtilities.js'
import { Clip, IntrinsicOptions } from '@moviemasher/runtime-shared'
import { Default } from '../../Setup/Default.js'
import { DataTypeBoolean, DataTypePercent, DataTypeString } from "../../Setup/DataTypeConstants.js"
import { propertyInstance } from "../../Setup/PropertyFunctions.js"
import { idGenerateString } from '../../Utility/IdFunctions.js'
import { assertNumber, assertPopulatedString } from '../SharedGuards.js'
import { isArray, isNumber, isUndefined } from "@moviemasher/runtime-shared"
import { isTimeRange } from "../TimeGuards.js"
import { rectFromSize, rectsEqual } from "../../Utility/RectFunctions.js"
import { sizeAboveZero } from "../../Utility/SizeFunctions.js"
import { Instance, InstanceArgs } from '@moviemasher/runtime-shared'
import { ContentRectArgs } from '@moviemasher/runtime-shared'
import { RectZero } from '../../Utility/RectConstants.js'
import { DefaultContentId } from '../../Helpers/Content/ContentConstants.js'
import { DefaultContainerId } from '../../Helpers/Container/ContainerConstants.js'
import { DataGroupOpacity, DataGroupPoint, DataGroupSize } from '../../Setup/DataGroupConstants.js'
import { ContainerRectArgs } from '@moviemasher/runtime-shared'
import { tweenColorStep, tweenCoverPoints, tweenCoverSizes, tweenNumberStep, tweenOverPoint, tweenOverRect, tweenOverSize, tweenRectsLock, tweenScaleSizeRatioLock, tweenScaleSizeToRect } from '../../Helpers/Tween/TweenFunctions.js'
import { LockWidth } from '../../Setup/LockConstants.js'
import { Directions, SideDirections } from '../../Setup/DirectionConstants.js'
import { SideDirectionObject } from '@moviemasher/runtime-shared'

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
    const range = this.clip.timeRange

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

  containerRects(args: ContainerRectArgs, inRect: Rect): RectTuple {
    // console.log(this.constructor.name, 'containerRects', inRect, args)
    const { size, time, timeRange } = args
    const { lock } = this
    const tweenRects = this.tweenRects(time, timeRange)
    
    const locked = tweenRectsLock(tweenRects, lock)

    // console.log(this.constructor.name, 'containerRects', tweenRects, lock, locked)
    
    const { width: inWidth, height: inHeight } = inRect
    
    const ratio = ((inWidth || size.width)) / ((inHeight || size.height))
    
    const [scale, scaleEnd] = locked 
    const forcedScale = tweenScaleSizeRatioLock(scale, size, ratio, lock)
    // console.log(this.constructor.name, 'containerRects forcedScale', forcedScale, '= tweenScaleSizeRatioLock(', scale, size, ratio, lock, ')')
    const { directionObject } = this
    const transformedRect = tweenScaleSizeToRect(size, forcedScale, directionObject)

    const tweening = !rectsEqual(scale, scaleEnd)
    if (!tweening) {
      // console.log(this.constructor.name, 'containerRects !tweening', transformedRect, locked)
      return [transformedRect, transformedRect]
    }

    const forcedScaleEnd = tweenScaleSizeRatioLock(scaleEnd, size, ratio, lock)
    const tweenRect = tweenOverRect(forcedScale, forcedScaleEnd)
    const tweened = tweenScaleSizeToRect(size, tweenRect, directionObject)
    const tuple: RectTuple = [transformedRect, tweened]
    return tuple
  }
  
  contentRects(args: ContentRectArgs): RectTuple {
    const {containerRects: rects, time, timeRange, loading, editing } = args
    const tuple = isArray(rects) ? rects : [rects, rects] as RectTuple
    
    const intrinsicRect = this.intrinsicRect(editing)
    if (!sizeAboveZero(intrinsicRect)) {
      return tuple
    }
    
    const { lock } = this
    const tweenRects = this.tweenRects(time, timeRange)
    const locked = tweenRectsLock(tweenRects, lock) 
    const coverSizes = tweenCoverSizes(intrinsicRect, rects, locked)
    const [size, sizeEnd] = coverSizes 
    const coverPoints = tweenCoverPoints(coverSizes, rects, locked)
    const [point, pointEnd] = coverPoints
    const rect = rectFromSize(size, point)
    const rectEnd = rectFromSize(sizeEnd, pointEnd)
    // console.log(this.constructor.name, 'contentRects', lock, locked, isArray(rects) ? rects[0] : rects,  '->', rect)
    return [rect, rectEnd]
  }
  
  get directionObject(): SideDirectionObject {
    return Object.fromEntries(SideDirections.map(direction => 
      [direction, !!this.value(`off${direction.slice(0, 1).toUpperCase()}`)]
    ))
  }
  get directions() { return Directions }
  
  frames(quantize: number): number {
    return timeFromArgs(Default.duration, quantize).frame
  }

  hasIntrinsicSizing = false

  hasIntrinsicTiming = false

  declare height: number

  protected _id?: string
  get id(): string { return this._id ||= idGenerateString() }

  initializeProperties(object: InstanceArgs): void {
    const { container } = this
  
    if (container) {
      // offN, offS, offE, offW
      SideDirections.forEach(direction => {
        this.addProperties(object, propertyInstance({
          name: `off${direction}`, type: DataTypeBoolean, 
          group: DataGroupPoint,
        }))
      })
      this.addProperties(object, propertyInstance({
        tweenable: true, name: 'opacity', 
        type: DataTypePercent, defaultValue: 1.0,
        group: DataGroupOpacity,
      }))       
    } 
    if (container || !this.isDefaultOrAudio) {
      this.addProperties(object, propertyInstance({
        name: 'x', type: DataTypePercent, defaultValue: 0.5,
        group: DataGroupPoint, tweenable: true, 
      }))
      this.addProperties(object, propertyInstance({
        name: 'y', type: DataTypePercent, defaultValue: 0.5,
        group: DataGroupPoint, tweenable: true, 
      }))
      this.addProperties(object, propertyInstance({
        name: 'lock', type: DataTypeString, defaultValue: LockWidth,
        group: DataGroupSize, 
      }))
    }
    this.properties.push(...this.asset.properties)
    super.initializeProperties(object)
  }

  instanceCachePromise(args: InstanceCacheArgs): Promise<void> {
    const { time } = args
    const assetTime = this.assetTime(time)
    const options: CacheOptions = { ...args, time: assetTime }
    return this.asset.assetCachePromise(options)
  }

  intrinsicRect(_ = false): Rect { return RectZero }

  intrinsicsKnown(options: IntrinsicOptions): boolean { return true }

  get isDefault() { 
    return [DefaultContentId, DefaultContainerId].includes(this.assetId) 
  }

  get isAudio() { return this.type === TypeAudio }
  get isDefaultOrAudio() { return this.isDefault || this.isAudio }
  
  protected _label = ''
  get label(): string { return this._label  }
  set label(value: string) { this._label = value }


  declare lock: Lock

  mutable() { return false }
  
  declare muted: boolean 
  
  declare offE: boolean
  declare offN: boolean
  declare offS: boolean
  declare offW: boolean
  declare opacity: number
  opacityEnd?: number | undefined

  toJSON(): UnknownRecord {
    const { assetId, label } = this
    return { ...super.toJSON(), assetId, label }
  }

  tween(keyPrefix: string, time: Time, range: TimeRange): Scalar {
    const value = this.value(keyPrefix)
    const valueEnd = this.value(`${keyPrefix}${PropertyTweenSuffix}`)
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

  tweenPoints(time: Time, range: TimeRange): PointTuple {
    const [x, xEndOrNot] = this.tweenValues('x', time, range)
    const [y, yEndOrNot] = this.tweenValues('y', time, range)
    assertNumber(x)
    assertNumber(y)
    const point: Point = { x, y } 
    const tweenPoint = { x: xEndOrNot, y: yEndOrNot }
    return [point, tweenOverPoint(point, tweenPoint)]
  }

  tweenRects(time: Time, range: TimeRange): RectTuple {
    const [size, sizeEnd] = this.tweenSizes(time, range)
    const [point, pointEnd] = this.tweenPoints(time, range)
    return [ { ...point , ...size }, { ...pointEnd , ...sizeEnd } ]
  }

  tweenSizes(time: Time, range: TimeRange): SizeTuple {
    const [width, widthEndOrNot] = this.tweenValues('width', time, range)
    const [height, heightEndOrNot] = this.tweenValues('height', time, range)
    assertNumber(width)
    assertNumber(height)
    const size: Size = { width, height } 
    const tweenSize = { width: widthEndOrNot, height: heightEndOrNot }
    return [size, tweenOverSize(size, tweenSize)]
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

