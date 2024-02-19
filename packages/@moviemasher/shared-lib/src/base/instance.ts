import type { Aspect, Asset, AssetCacheArgs, Clip, ContainerRectArgs, ContentRectArgs, DataOrError, Instance, InstanceArgs, InstanceCacheArgs, InstanceObject, IntrinsicOptions, Lock, Point, Points, Rect, RectTuple, SideDirectionRecord, Size, SizeKey, Sizes, Strings, Time, TimeRange, UnknownRecord } from '../types.js'

import { $ASPECT, $AUDIO, $BOOLEAN, $CEIL, $CROP, $END, $FLIP, $HEIGHT, $LOCK, $LONGEST, $MAINTAIN, $NONE, $PERCENT, $POINT, $SHORTEST, $SIZE, $STRING, $WIDTH, $X, $Y, ASPECTS, ASSET_DURATION, DASH, DEFAULT_CONTAINER_ID, DEFAULT_CONTENT_ID, DIRECTIONS_SIDE, LOCKS, RECT_ZERO, assertTuple, idGenerate } from '../runtime.js'
import { isDefined } from '../utility/guard.js'
import { assertAboveZero, assertPositive, assertSize } from '../utility/guards.js'
import { isPositive } from '../utility/guard.js'
import { assertSizeNotZero, containerPoints, containerSizes, contentPoints, contentSizes, sizeNotZero } from '../utility/rect.js'
import { timeFromArgs } from '../utility/time.js'
import { PropertiedClass } from './propertied.js'


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

  container = false

  containerRects(args: ContainerRectArgs, size: Size): RectTuple {
    const { outputSize, time, timeRange } = args
    const inSize = sizeNotZero(size) ? size : this.intrinsicRect
    assertSizeNotZero(outputSize, 'outputSize')
    const { pointAspect, sizeAspect, sizeKey, cropDirections } = this
    const containerTweenRects = this.scaleRects(time, timeRange)
    containerTweenRects.forEach(rect => {
      assertSize(rect, 'containerTweenRects')
    })
    const sizes = containerSizes(containerTweenRects, inSize, outputSize, sizeAspect, $CEIL, sizeKey)
    sizes.forEach(size => assertSizeNotZero(size, 'containerRects size'))
    
    const points = containerPoints(containerTweenRects, sizes, outputSize, pointAspect, cropDirections, $CEIL)
    const rects = sizes.map((size, index) => ({ ...size, ...points[index] }))
    assertTuple<Rect>(rects)
    return rects
  }
  
  contentRects(args: ContentRectArgs): RectTuple {
    const { containerRects, time, timeRange, outputSize } = args    
    const { sizeKey, intrinsicRect, sizeAspect, pointAspect } = this
    // if I have no intrinsic size (like color source), use the container rects
    if (!sizeNotZero(intrinsicRect)) return containerRects

    const tweenRects = this.scaleRects(time, timeRange)
    const points = contentPoints(tweenRects, intrinsicRect, containerRects, outputSize, sizeAspect, pointAspect, $CEIL, sizeKey)
    const sizes = contentSizes(tweenRects, intrinsicRect, containerRects, outputSize, sizeAspect, $CEIL, sizeKey)
    const rects = sizes.map((size, index) => ({ ...size, ...points[index] }))
    assertTuple<Rect>(rects)
    return rects
  }
  
  frames(quantize: number): number {
    assertAboveZero(quantize, 'frames quantize') 

    return timeFromArgs(ASSET_DURATION, quantize).frame
  }


  hasIntrinsicTiming = false

  declare height: number

  protected _id?: string
  get id(): string { return this._id ||= idGenerate([this.container ? 'container' : 'content', ...this.clip.clipIndex].join(DASH)) } //idGenerate(this.label || this.asset.label || this.asset.id) }

  override initializeProperties(object: InstanceArgs): void {
    const { container, targetId } = this
    // console.log(this.constructor.name, 'initializeProperties', this.asset.label, { container, targetId })
    if (container) {
      DIRECTIONS_SIDE.forEach(direction => {
        this.properties.push(this.propertyInstance({
          targetId, name: `${direction}${$CROP}`, 
          type: $BOOLEAN, defaultValue: false, 
        }))
      })
    } 
    if (container || !(this.isDefault || this.isAudio)) {
      this.properties.push(this.propertyInstance({
        targetId, name: $X, type: $PERCENT, defaultValue: 0.5,
        min: 0.0, max: 1.0, step: 0.01, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId, name: [$X, $END].join(''), 
        type: $PERCENT, undefinedAllowed: true, tweens: true,
        min: 0.0, max: 1.0, step: 0.01,
      }))
      this.properties.push(this.propertyInstance({
        targetId, name: $Y, type: $PERCENT, defaultValue: 0.5,
        min: 0.0, max: 1.0, step: 0.01, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId, name: [$Y, $END].join(''), 
        type: $PERCENT, undefinedAllowed: true, tweens: true,
        min: 0.0, max: 1.0, step: 0.01,
      }))
      this.properties.push(this.propertyInstance({
        targetId, name: $LOCK, type: $STRING, 
        defaultValue: $SHORTEST, options: LOCKS, 
      }))
      this.properties.push(this.propertyInstance({
        targetId, name: [$POINT, $ASPECT].join(''), type: $STRING, 
        defaultValue: $MAINTAIN, options: ASPECTS, 
      }))
      this.properties.push(this.propertyInstance({
        targetId, name: [$SIZE, $ASPECT].join(''), type: $STRING, 
        defaultValue: $FLIP, options: ASPECTS, 
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

  intrinsicsKnown(_: IntrinsicOptions): boolean { return true }

  get isDefault() { 
    return [DEFAULT_CONTENT_ID, DEFAULT_CONTAINER_ID].includes(this.assetId) 
  }

  get isAudio() { return this.type === $AUDIO }

  protected _label = ''
  get label(): string { return this._label  }
  set label(value: string) { this._label = value }

  declare lock: Lock

  get canBeMuted() { return false }
  
  declare muted: boolean 

  declare leftCrop: boolean
  declare rightCrop: boolean
  declare topCrop: boolean
  declare bottomCrop: boolean

  declare pointAspect: Aspect

  get sizeKey(): SizeKey | undefined {
    const { lock } = this
    switch (lock) {
      case $NONE: return
      case $WIDTH: 
      case $HEIGHT: return lock
    }
    const size = this.intrinsicRect
    const portrait = size.width < size.height
    
    switch (lock) {
      case $SHORTEST: return portrait ? $WIDTH : $HEIGHT
      case $LONGEST: return portrait ? $HEIGHT : $WIDTH
    }
  }

  get cropDirections(): SideDirectionRecord {
    return Object.fromEntries(DIRECTIONS_SIDE.map(direction => {
      const key = `${direction}${$CROP}`
      const value = this.value(key)
      return [direction, Boolean(value)]
    })) 
  }

  declare sizeAspect: Aspect

  toJSON(): UnknownRecord {
    const { assetId, label } = this
    return { ...super.toJSON(), assetId, label }
  }

  private tweenPoints(time: Time, range: TimeRange): Points {
    const [xStart, xEndOrNot] = this.tweenValues($X, time, range)
    const [yStart, yEndOrNot] = this.tweenValues($Y, time, range)

    if (!(isPositive(xStart) && isPositive(yStart))) {
      console.log('InstanceClass.tweenPoints', this.x, this.xEnd, this.y, this.yEnd, { xStart, yStart, xEndOrNot, yEndOrNot }, time, range)
    }
    assertPositive(xStart, 'xStart')
    assertPositive(yStart, 'yStart')
    const point: Point = { x: xStart, y: yStart } 
    const points: Points = [point]
    if (isDefined(xEndOrNot) || isDefined(yEndOrNot)) {
      const x = isDefined(xEndOrNot) ? xEndOrNot : xStart
      const y = isDefined(yEndOrNot) ? yEndOrNot : yStart
      // console.log('InstanceClass.tweenPoints', { x, y }, time, range)
      assertPositive(x, 'x')
      assertPositive(y, 'y')

      points.push({ x, y }) 
    }
    return points
  }

  scaleRects(time: Time, range: TimeRange): RectTuple {
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
    const [widthStart, widthEndOrNot] = this.tweenValues($WIDTH, time, range)
    const [heightStart, heightEndOrNot] = this.tweenValues($HEIGHT, time, range)

    assertPositive(widthStart)
    assertPositive(heightStart)
    const size: Size = { width: widthStart, height: heightStart } 
    const sizes: Sizes = [size]
    if (isDefined(widthEndOrNot) || isDefined(heightEndOrNot)) {
      const width = isDefined(widthEndOrNot) ? widthEndOrNot : widthStart
      const height = isDefined(heightEndOrNot) ? heightEndOrNot : heightStart
      assertPositive(width)
      assertPositive(height)
      
      sizes.push({ width, height })
    }
    return sizes
  }

  declare width: number

  declare x: number

  declare y: number
}
