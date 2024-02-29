import type { Asset, AudioInstance, Clip, ClipIndex, ClipObject, ContainerInstance, ContainerRectArgs, ContentInstance, DataOrError, Instance, InstanceCacheArgs, InstanceObject, IntrinsicOptions, Rect, RectTuple, Size, Sizing, Strings, Time, TimeRange, Timing, Track, Transparency, UnknownRecord, VisibleInstance, VisibleInstanceObject } from '../types.js'

import { $OPACITY, $ALPHA, ASSET_DURATION, $CLIP, $CONTAINER, $CONTAINER_ID, $CONTENT, $CONTENT_ID, $CUSTOM, DEFAULT_CONTAINER_ID, DEFAULT_CONTENT_ID, DURATION_NONE, DURATION_UNKNOWN, $END, $FRAME, $MASH, $PERCENT, POINT_ZERO, SIZINGS, $STRING, TIMINGS, TRANSPARENCIES, idGenerateString, assertAsset, $FRAMES } from '../runtime.js'
import { isPopulatedString } from '../utility/guard.js'
import { isUndefined } from '../utility/guard.js'
import { assertAboveZero, assertCanBeContainerInstance, assertCanBeContentInstance, assertDefined, assertPositive, isAudioAsset, canBeContainerInstance, canBeContentInstance, isVisibleInstance, assertAudioInstance, assertPopulatedString, isAudibleInstance } from '../utility/guards.js'
import { isAboveZero } from '../utility/guard.js'
import { promiseNumbers } from '../runtime.js'
import { timeFromArgs, timeRangeFromArgs } from '../utility/time.js'
import { PropertiedClass } from './propertied.js'
import { assertSizeNotZero } from '../utility/rect.js'

export class ClipClass extends PropertiedClass implements Clip {
  constructor(object: ClipObject) {
    const { contentId, sizing, timing, container, content } = object 
    const defaultContent = isUndefined(contentId) || contentId === DEFAULT_CONTENT_ID

    if (defaultContent && !sizing) object.sizing = $CONTAINER
    if (defaultContent && !timing) object.timing = $CONTAINER    
    
    super(object)

    const targetId = $CLIP
    this.properties.push(this.propertyInstance({ 
      targetId, name: 'label', type: $STRING, order: 1,
    }))
    this.properties.push(this.propertyInstance({
      targetId, name: 'containerId', type: $CONTAINER_ID,
      defaultValue: DEFAULT_CONTAINER_ID, order: 5,
    }))
    this.properties.push(this.propertyInstance({
      targetId, name: 'contentId', type: $CONTENT_ID,
      defaultValue: DEFAULT_CONTENT_ID, order: 5,
    }))
    this.properties.push(this.propertyInstance({ 
      targetId, name: 'sizing', type: $STRING, 
      defaultValue: $CONTENT, options: SIZINGS, order: 2,
    }))
    this.properties.push(this.propertyInstance({ 
      targetId, name: 'timing', type: $STRING, 
      defaultValue: $CONTENT, options: TIMINGS, order: 3,
    }))
    this.properties.push(this.propertyInstance({ 
      targetId, name: $FRAME, type: $FRAME, 
      defaultValue: DURATION_NONE, min: 0, step: 1, 
    }))
    this.properties.push(this.propertyInstance({ 
      targetId, name: $FRAMES, type: $FRAME, 
      defaultValue: DURATION_UNKNOWN, min: 1, step: 1, 
    }))

    this.properties.push(this.propertyInstance({ 
      targetId, name: 'transparency', 
      defaultValue: $ALPHA, options: TRANSPARENCIES, type: $STRING, order: 1,
    }))
    this.properties.push(this.propertyInstance({
      targetId, name: $OPACITY, type: $PERCENT, 
      defaultValue: 1.0, min: 0.0, max: 1.0, step: 0.01, tweens: true,
    }))       
    this.properties.push(this.propertyInstance({
      targetId, name: [$OPACITY, $END].join(''), 
      type: $PERCENT, undefinedAllowed: true, tweens: true,
      min: 0.0, max: 1.0, step: 0.01,
    }))  

    if (container) this._containerObject = container
    if (content) this._contentObject = content
  }

  asset(assetIdOrObject: string): Asset {
    const { track } = this
    assertDefined(track)

    const { mash } = track
    const asset = mash.asset(assetIdOrObject)
    assertAsset(asset)
    
    return asset
  }

  get assetIds(): Strings {
    const ids = this.content.assetIds
    if (this.container) ids.push(...this.container.assetIds)
    return ids
  }

  private assureTimingAndSizing(timing: Timing, sizing: Sizing, instance: Instance) {
    const myTiming = this.value('timing')
    const mySizing = this.value('sizing')
    const containerId = this.value('containerId')
    let timingOk: boolean | undefined = myTiming !== timing
    let sizingOk: boolean | undefined = mySizing !== sizing
    timingOk ||= isAudibleInstance(instance) && instance.asset.hasIntrinsicTiming
    sizingOk ||= isVisibleInstance(instance) && instance.asset.hasIntrinsicSizing
    if (!timingOk) {
      this.setValue('timing', timing === $CONTENT && containerId ? $CONTAINER : $CUSTOM)
    }
    if (!sizingOk) {
      this.setValue('sizing', sizing === $CONTENT && containerId ? $CONTAINER : $MASH)
    }
    return !(sizingOk && timingOk)
  }

  get audible(): boolean { return this.canBeMuted }

  get canBeMuted(): boolean {
    const { content } = this
    const contentMutable = content.canBeMuted
    if (contentMutable) return true

    const { container } = this
    if (!container) return false
    const containerMutable = container.canBeMuted
    return  containerMutable
  }

  clipCachePromise(args: InstanceCacheArgs): Promise<DataOrError<number>> {
    const { content, container, frames } = this
    if (isAboveZero(frames)) args.clipTime ||= this.timeRange
    const promises = [content.instanceCachePromise(args)]
    if (container) promises.push(container.instanceCachePromise(args))
    // console.log(this.constructor.name, 'clipCachePromise', args, promises.length)
    return promiseNumbers(promises)
  }

  get clipIndex(): ClipIndex {
    const { track } = this
    assertDefined(track)

    const [mashIndex, trackIndex] = track.trackIndex
    return [mashIndex, trackIndex, track.clips.indexOf(this)]
  }

  get clipObject(): ClipObject {
    const object: ClipObject = { ...this.scalarRecord }
    const { content, container } = this
    object.content = content.instanceObject
    if (container) {
      object.container = container.instanceObject
    } else object.containerId = ''
    // console.log(this.constructor.name, 'clipObject', object)
    return object
  }

  protected _containerObject: InstanceObject = {}

  protected _container?: ContainerInstance
  get container(): ContainerInstance | undefined { return this._container ||= this.containerInitialize }
  protected get containerInitialize(): VisibleInstance | undefined {
    const { _containerObject: containerObject } = this
    const containerId = this.value('containerId')
    const assetId = containerId || containerObject.assetId
    if (!isPopulatedString(assetId)) return undefined

    const asset = this.asset(assetId)
    const object: VisibleInstanceObject  = { ...containerObject, assetId, container: true }
    const instance = asset.instanceFromObject(object)
    assertCanBeContainerInstance(instance)

    this.assureTimingAndSizing($CONTAINER, $CONTAINER, instance)
    instance.clip = this
    const timing = this.value('timing')
    if (timing === $CONTAINER && this.track) this.resetTiming(instance)
    return instance
  }

  clipRects(args: ContainerRectArgs): RectTuple {
    const { outputSize: size, loading } = args
    const { container } = this
    assertCanBeContainerInstance(container)
    
    const rect = this.sizingRect(size, loading)
    return container.containerRects(args, rect)
  }

  protected _contentObject: InstanceObject = {}
  
  get content(): ContentInstance | AudioInstance { return this._content ||= this.contentInitialize }
  
  protected _content?: ContentInstance | AudioInstance
  
  protected get contentInitialize(): ContentInstance | AudioInstance {
    const { _contentObject: contentObject } = this
    const contentId = this.value('contentId')
    const assetId = contentId || contentObject.assetId
    assertPopulatedString(assetId)
    
    const asset = this.asset(assetId)
    const object: InstanceObject = { ...contentObject, assetId }
    const content = asset.instanceFromObject(object)
    if (isAudioAsset(asset)) {
      this._container = undefined
      this._containerObject = {}
      this.setValue('containerId', '')
      assertAudioInstance(content)
    } else {
      assertCanBeContentInstance(content)
    }
    if (this.assureTimingAndSizing($CONTENT, $CONTENT, content)) {
      const { container } = this
      if (container) {
        this.assureTimingAndSizing($CONTAINER, $CONTAINER, container)
      }
    }
    content.clip = this
    const timing = this.value('timing')
    if (timing === $CONTENT && this.track) this.resetTiming(content)
    return content
  }

  get endFrame() { return this.frame + this.frames }

  endTime(quantize : number) : Time {
    return timeFromArgs(this.endFrame, quantize)
  }

  get frame(): number { return this.number($FRAME) }
  set frame(value: number) { this.setValue($FRAME, value) }
  get frames(): number { return this.number($FRAMES) }
  set frames(value: number) { this.setValue($FRAMES, value) }

  intrinsicsKnown(options: IntrinsicOptions): boolean {
    const { content, container } = this
    let known = content.intrinsicsKnown(options)
    // console.log(this.constructor.name, 'intrinsicsKnown content', known, options)
    if (known && container) {
      known = container.intrinsicsKnown(options)
      // console.log(this.constructor.name, 'intrinsicsKnown container', known, options)
    }
    return known
  }

  protected _id?: string

  get id(): string { return this._id ||= idGenerateString() }
  
  maxFrames(_quantize : number, _trim? : number) : number { return 0 }

  get muted(): boolean {
    const { content } = this
    if (content.canBeMuted && content.muted) return true

    const { container } = this
    if (container && container.canBeMuted && container.muted) return true

    return false
  }
  
  sizingRect(size: Size, loading?: boolean): Rect {
    const rect = { ...size, ...POINT_ZERO }
    const sizing = this.string('sizing')
    if (sizing === $MASH) {
      // console.debug(this.constructor.name, 'sizingRect', {sizing, rect})
      return rect
    }

    const target = sizing === $CONTAINER ? this.container : this.content
    assertDefined(target)
    if (!(isVisibleInstance(target) && target.asset.hasIntrinsicSizing)) return rect

    const known = target.intrinsicsKnown({ size: true })
    // console.debug(this.constructor.name, 'sizingRect', target.asset.value('label'), { sizing, rect, known, loading})
    if (loading && !known) return rect

    const { intrinsicRect } = target
    assertSizeNotZero(intrinsicRect, 'sizingRect')

    return intrinsicRect
  }

  private get quantizeNumber(): number { 
    const { track } = this
    assertDefined(track)

    return track.mash.number('quantize')
  }

  private resetFrames(instance?: Instance, quantize?: number): number {
    const timing = this.value('timing')    
    switch(timing) {
      case $CUSTOM: {
        if (isAboveZero(this.frames)) break

        return ASSET_DURATION * (quantize || this.quantizeNumber)
      }
      case $CONTAINER: {
        const container = canBeContainerInstance(instance) ? instance : this.container
        if (!container?.asset.hasIntrinsicTiming) {
          // console.log(this.constructor.name, 'resetTiming SET timing from container to content')
          this.setValue('timing', $CONTENT)
          break
        }
        return container.frames(quantize || this.quantizeNumber)
        // console.log('resetTiming SET frames from container', this.frames, { quantize })
      }
      case $CONTENT: {
        const content = canBeContentInstance(instance) ? instance : this.content
        if (!content) break

        if (!content.asset.hasIntrinsicTiming) {
          // console.log(this.constructor.name, 'resetTiming SET timing content to custom')
          this.setValue('timing', $CUSTOM)
          break
        }
        return content.frames(quantize || this.quantizeNumber)
      }
    }
    return DURATION_UNKNOWN
  } 

  resetTiming(instance?: Instance, quantize?: number): void {
    const resetFrames = this.resetFrames(instance, quantize)
    if (!isAboveZero(resetFrames)) return

    this.frames = resetFrames
    const { track } = this
    if (!track) return
    
    track.sortClips() 
  }

  get timeRange() : TimeRange {
    const { frame, frames, quantizeNumber: quantize } = this
    assertPositive(frame, $FRAME)
    assertAboveZero(quantize, 'quantize')
    assertAboveZero(frames, $FRAMES)
    return timeRangeFromArgs(frame, quantize, frames)
  }

  toJSON(): UnknownRecord {
    const json = super.toJSON()
    const { container, content } = this
    json.content = content
    if (container) json.container = container
    else json.containerId = ''
    return json
  }

  track?: Track 

  get trackNumber(): number { return this.track ? this.track.index : -1 }

  set trackNumber(value: number) { if (value < 0) delete this.track }

  protected get tweening(): boolean { 
    const { content, container } = this
    let tweening = container?.tweening || false
    tweening ||= isVisibleInstance(content) && content.tweening
  
    return tweening
  }

  get visible(): boolean {  return !!this.value('containerId') }
}
