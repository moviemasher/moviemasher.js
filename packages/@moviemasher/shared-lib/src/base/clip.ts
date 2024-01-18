import type { Asset, AssetObject, AudioInstance, AudioInstanceObject, Clip, ClipIndex, ClipObject, ContainerInstance, ContainerRectArgs, ContentInstance, DataOrError, Instance, InstanceCacheArgs, InstanceObject, IntrinsicOptions, Rect, RectTuple, Scalar, ScalarTuple, Size, Sizing, Strings, Time, TimeRange, Timing, Track, Transparency, UnknownRecord, VisibleInstance, VisibleInstanceObject } from '../types.js'

import { ALPHA, ASSET_DURATION, BOOLEAN, CLIP_TARGET, CONTAINER, CONTAINER_ID, CONTENT, CONTENT_ID, CUSTOM, DEFAULT_CONTAINER_ID, DEFAULT_CONTENT_ID, DURATION_NONE, DURATION_UNKNOWN, ERROR, FRAME, MASH, MOVIEMASHER, POINT_ZERO, SIZINGS, STRING, TIMINGS, TRANSPARENCIES, errorThrow, idGenerateString, isPopulatedString, isUndefined, namedError } from '../runtime.js'
import { assertAboveZero, assertCanBeContainerInstance, assertCanBeContentInstance, assertDefined, assertPopulatedString, assertPositive, assertVisibleInstance, isAboveZero, isAudioAsset, canBeContainerInstance, canBeContentInstance, isVisibleInstance } from '../utility/guards.js'
import { promiseNumbers } from '../utility/request.js'
import { timeFromArgs, timeRangeFromArgs } from '../utility/time.js'
import { PropertiedClass } from './propertied.js'

export class ClipClass extends PropertiedClass implements Clip {
  constructor(object: ClipObject) {

    super(object)
    this.initializeProperties(object)
  }

  asset(_: string | AssetObject): Asset {
    return errorThrow(ERROR.Unimplemented)
  }


  get assetIds(): Strings {
    const ids = this.content.assetIds
    if (this.container) ids.push(...this.container.assetIds)
    return ids
  }

  private assureTimingAndSizing(timing: Timing, sizing: Sizing, instance: Instance) {
    const { timing: myTiming, sizing: mySizing, containerId } = this
    let timingOk = myTiming !== timing
    let sizingOk = mySizing !== sizing

    timingOk ||= instance.hasIntrinsicTiming
    sizingOk ||= instance.hasIntrinsicSizing

    if (!timingOk) {
      if (timing === CONTENT && containerId) {
        this.timing = CONTAINER
      } else this.timing = CUSTOM
    }
    if (!sizingOk) {
      if (sizing === CONTENT && containerId) {
        this.sizing = CONTAINER 
      } else this.sizing = MASH
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
    const { containerId, _containerObject: containerObject } = this
    const assetId = containerId || containerObject.assetId
    if (!isPopulatedString(assetId)) return undefined

    // console.log(this.constructor.name, 'containerInitialize', assetId, containerId)
    const asset = this.asset(assetId)

    const object: VisibleInstanceObject  = { ...containerObject, assetId, container: true }
    const instance = asset.instanceFromObject(object)
    assertCanBeContainerInstance(instance)

    this.assureTimingAndSizing(CONTAINER, CONTAINER, instance)
    instance.clip = this
    if (this.timing === CONTAINER && this._track) this.resetTiming(instance)
    return instance
  }

  declare containerId: string

  clipRects(args: ContainerRectArgs): RectTuple {
    const { size, loading } = args
    const { container } = this
    assertCanBeContainerInstance(container)
    
    return container.containerRects(args, this.sizingRect(size, loading))
  }

  protected _contentObject: InstanceObject = {}
  
  get content(): ContentInstance | AudioInstance { return this._content ||= this.contentInitialize }
  
  protected _content?: ContentInstance | AudioInstance
  
  protected get contentInitialize(): ContentInstance | AudioInstance {
    const { contentId, _contentObject: contentObject } = this
    const assetId = contentId || contentObject.assetId
    assertPopulatedString(assetId)

    // console.log(this.constructor.name, 'contentInitialize', assetId, contentId)

    const asset = this.asset(assetId)

    if (isAudioAsset(asset)) {
      this._container = undefined
      this._containerObject = {}
      this.containerId = ''
    }

    const object: InstanceObject = { ...contentObject, assetId }
    const content = asset.instanceFromObject(object)
    assertCanBeContentInstance(content)

    if (this.assureTimingAndSizing(CONTENT, CONTENT, content)) {
      const { container } = this
      if (container) {
        this.assureTimingAndSizing(CONTAINER, CONTAINER, container)
      }
    }

    content.clip = this

    if (this.timing === CONTENT && this._track) this.resetTiming(content)
    return content
  }

  declare contentId: string

  get endFrame() { return this.frame + this.frames }

  endTime(quantize : number) : Time {
    return timeFromArgs(this.endFrame, quantize)
  }

  declare frame: number

  declare frames: number
  
  override initializeProperties(object: ClipObject): void {
    const { contentId, sizing, timing } = object
    const defaultContent = isUndefined(contentId) || contentId === DEFAULT_CONTENT_ID

    if (defaultContent && !sizing) object.sizing = CONTAINER
    if (defaultContent && !timing) object.timing = CONTAINER    
    
    this.properties.push(this.propertyInstance({ 
      targetId: CLIP_TARGET, name: 'label', type: STRING, order: 1,
    }))
    this.properties.push(this.propertyInstance({
      targetId: CLIP_TARGET, name: 'containerId', type: CONTAINER_ID,
      defaultValue: DEFAULT_CONTAINER_ID, order: 5,
    }))
    this.properties.push(this.propertyInstance({
      targetId: CLIP_TARGET, name: 'contentId', type: CONTENT_ID,
      defaultValue: DEFAULT_CONTENT_ID, order: 5,
    }))
    this.properties.push(this.propertyInstance({ 
      targetId: CLIP_TARGET, name: 'sizing', type: STRING, 
      defaultValue: CONTENT, options: SIZINGS, order: 2,
    }))
    this.properties.push(this.propertyInstance({ 
      targetId: CLIP_TARGET, name: 'timing', type: STRING, 
      defaultValue: CONTENT, options: TIMINGS, order: 3,
    }))
    this.properties.push(this.propertyInstance({ 
      targetId: CLIP_TARGET, name: FRAME, type: FRAME, 
      defaultValue: DURATION_NONE, min: 0, step: 1, 
    }))
    this.properties.push(this.propertyInstance({ 
      targetId: CLIP_TARGET, name: 'frames', type: FRAME, 
      defaultValue: DURATION_UNKNOWN, min: 1, step: 1, 
    }))

    this.properties.push(this.propertyInstance({ 
      targetId: CLIP_TARGET, name: 'transparency', 
      defaultValue: ALPHA, options: TRANSPARENCIES, type: STRING, order: 1,
    }))

    super.initializeProperties(object)
   
    const { container, content } = object as ClipObject
    if (container) this._containerObject = container
    if (content) this._contentObject = content
  }

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

  protected _label = ''
  get label(): string { return this._label  }
  set label(value: string) { this._label = value }

  declare transparency: Transparency
  
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
    const { sizing } = this
    if (sizing === MASH) return rect

    const target = sizing === CONTAINER ? this.container : this.content
    assertDefined(target)

    const known = target.intrinsicsKnown({ size: true })
    if (loading && !known) return rect

    return target.intrinsicRect
  }

  private resetFrames(instance?: Instance, quantize?: number): number {
    const { timing, track } = this
   
    switch(timing) {
      case CUSTOM: {
        if (isAboveZero(this.frames)) break

        return ASSET_DURATION * (quantize || track!.mash.quantize)
      }
      case CONTAINER: {
        const container = canBeContainerInstance(instance) ? instance : this.container
           if (!container) break
           
           if (!container.hasIntrinsicTiming) {
          // console.log(this.constructor.name, 'resetTiming SET timing from container to content')
          this.setValue('timing', CONTENT)
          break
        }
        return container.frames(quantize || track!.mash.quantize)
        // console.log('resetTiming SET frames from container', this.frames, { quantize })
      }
      case CONTENT: {
        const content = canBeContentInstance(instance) ? instance : this.content
        if (!content) break

        if (!content.hasIntrinsicTiming) {
          // console.log(this.constructor.name, 'resetTiming SET timing content to custom')
          this.setValue('timing', CUSTOM)
          break
        }
        return content.frames(quantize || track!.mash.quantize)
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


  declare sizing: Sizing

  get timeRange() : TimeRange {
    const { frame, frames, track } = this
    const { quantize } = track.mash
    assertPositive(frame, 'timeRange frame')
    assertAboveZero(frames, 'timeRange frames')

    return timeRangeFromArgs(this.frame, quantize, this.frames)
  }

  declare timing: Timing

  toJSON(): UnknownRecord {
    const json = super.toJSON()
    const { container, content } = this
    json.content = content
    if (container) json.container = container
    else json.containerId = ''
    return json
  }

  toString(): string { return `[Clip ${this.label}]` }

  track!: Track 

  get trackNumber(): number { return this.track ? this.track.index : -1 }

  set trackNumber(value: number) { if (value < 0) delete this._track }

  protected get tweening(): boolean { 
    const { content, container } = this
    let tweening = container?.tweening || false
    tweening ||= isVisibleInstance(content) && content.tweening
  
    return tweening
  }

  get visible(): boolean { return !!this.containerId }
}
