import type { Time, TimeRange, Point, PointTuple, Rect, RectTuple, Size, SizeTuple,  UnknownRecord, Scalar, Strings, Lock } from '@moviemasher/runtime-shared'
import { TypeAudio, } from '@moviemasher/runtime-shared'
import { Asset } from '../Asset/Asset.js'
import { CacheOptions, CommandFilterArgs, InstanceCacheArgs } from '../../Base/Code.js'
import { PropertyTweenSuffix } from "../../Base/PropertiedConstants.js"
import { PropertiedClass } from "../../Base/PropertiedClass.js"
import { timeFromArgs } from '../../Helpers/Time/TimeUtilities.js'
import { Clip, IntrinsicOptions } from '../Mash/Clip/Clip.js'
import { Filter } from '../../Plugin/Filter/Filter.js'
import { filterFromId } from '../../Plugin/Filter/FilterFactory.js'
import { Default } from '../../Setup/Default.js'
import { DataTypeBoolean, DataTypePercent, DataTypeString } from "../../Setup/DataTypeConstants.js"
import { propertyInstance } from "../../Setup/PropertyFunctions.js"
import { idGenerateString } from '../../Utility/Id.js'
import { assertNumber, assertPopulatedString, isArray, isNumber, isTimeRange, isUndefined } from '../SharedGuards.js'
import { rectFromSize, rectsEqual } from "../../Utility/RectFunctions.js"
import { sizeAboveZero } from "../../Utility/SizeFunctions.js"
import { Instance, InstanceArgs } from './Instance.js'
import { Effects } from '../../Effect/Effect.js'
import { ContentRectArgs } from '../../Helpers/Content/ContentRectArgs.js'
import { RectZero } from '../../Utility/RectConstants.js'
import { DefaultContentId } from '../../Helpers/Content/ContentConstants.js'
import { DefaultContainerId } from '../../Helpers/Container/ContainerConstants.js'
import { DataGroupOpacity, DataGroupPoint, DataGroupSize } from '../../Setup/DataGroupConstants.js'
import { effectInstance } from '../../Effect/EffectFactory.js'
import { ContainerRectArgs } from '../../Helpers/Container/Container.js'
import { tweenColorStep, tweenCoverPoints, tweenCoverSizes, tweenNumberStep, tweenOverPoint, tweenOverRect, tweenOverSize, tweenRectsLock, tweenScaleSizeRatioLock, tweenScaleSizeToRect } from '../../Helpers/TweenFunctions.js'
import { Directions, LockWidth, SideDirections } from "../../Setup/EnumConstantsAndFunctions.js"
import { SideDirectionObject } from '../../Setup/Direction.js'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'


export class InstanceClass extends PropertiedClass implements Instance {
  constructor(object: InstanceArgs) {
    super()
    const { asset, container, effects } = object
    this.asset = asset 
    if (container) {
      this.container = true
      this.addProperties(object, propertyInstance({
        name: 'x', type: DataTypePercent, defaultValue: 0.5,
        group: DataGroupPoint, tweenable: true, 
      }))
      this.addProperties(object, propertyInstance({
        name: 'y', type: DataTypePercent, defaultValue: 0.5,
        group: DataGroupPoint, tweenable: true, 
      }))
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
    } else {
      if (!this.isDefaultOrAudio) {
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
        if (effects) this.effects.push(...effects.map(effectInstance))
      }   
    }
  }
  instanceCachePromise(args: InstanceCacheArgs): Promise<void> {
    const { time } = args
    const assetTime = this.assetTime(time)
    const options: CacheOptions = { ...args, time: assetTime }
    return this.asset.assetCachePromise(options)
  }
  opacityEnd?: number | undefined

  asset: Asset
  
  get assetId(): string { return this.asset.id }

  get assetIds(): Strings {
    return [
      ...this.asset.assetIds,
      ...this.effects.flatMap(effect => effect.assetIds),
    ]
  }

  private _clip?: Clip
  get clip() { return this._clip! }
  set clip(value: Clip) { this._clip = value }
  get clipped(): boolean { return !!this._clip }

  _colorFilter?: Filter
  get colorFilter() { return this._colorFilter ||= filterFromId('color') }

  container = false

  /**
   * 
   * @param args 
   * @param inRect 
   * @returns 
   */
  containerRects(args: ContainerRectArgs, inRect: Rect): RectTuple {
    // console.log(this.constructor.name, 'containerRects', inRect, args)
    const { size, time, timeRange } = args
    const { lock } = this
    const tweenRects = this.tweenRects(time, timeRange)
    const locked = tweenRectsLock(tweenRects, lock)
    
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
    if (!sizeAboveZero(intrinsicRect)) return tuple
    
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
  
  private _cropFilter?: Filter 
  get cropFilter() { return this._cropFilter ||= filterFromId('crop') }
  
  
  assetTime(mashTime : Time) : Time {
    const range = this.clip.timeRange

    const { fps: quantize, startTime, endTime } = range
    const scaledTime = mashTime.scaleToFps(quantize) // may have fps higher than quantize and time.fps
    const frame = Math.max(Math.min(scaledTime.frame, endTime.frame), startTime.frame)
    return scaledTime.withFrame(frame - startTime.frame)
  }

  get directionObject(): SideDirectionObject {
    return Object.fromEntries(SideDirections.map(direction => 
      [direction, !!this.value(`off${direction.slice(0, 1).toUpperCase()}`)]
    ))
  }
  get directions() { return Directions }

  effects: Effects = []
  
  frames(quantize: number): number {
    return timeFromArgs(Default.duration, quantize).frame
  }

  hasIntrinsicSizing = false

  hasIntrinsicTiming = false

  declare height: number

  protected _id?: string
  get id(): string { return this._id ||= idGenerateString() }

  initializeProperties(object: unknown): void {
    this.properties.push(...this.asset.properties)
    super.initializeProperties(object)
  }

  intrinsicRect(_ = false): Rect { return RectZero }

  intrinsicsKnown(options: IntrinsicOptions): boolean { return true }

  get isDefault() { 
    return [DefaultContentId, DefaultContainerId].includes(this.assetId) 
  }

  get isDefaultOrAudio() { return this.isDefault || this.type === TypeAudio }
  
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


  private _opacityFilter?: Filter
  get opacityFilter() { return this._opacityFilter ||= filterFromId('opacity')}
  
  private _overlayFilter?: Filter
  get overlayFilter() { return this._overlayFilter ||= filterFromId('overlay')}

  private _scaleFilter?: Filter
  get scaleFilter() { return this._scaleFilter ||= filterFromId('scale')}

  toJSON(): UnknownRecord {
    const { effects, assetId, label } = this
    return { ...super.toJSON(), effects, assetId, label }
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

