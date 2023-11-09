import type { Asset, AssetObject, Clip, ClipObject, ContainerRectArgs, DataOrError, Instance, InstanceCacheArgs, InstanceObject, IntrinsicOptions, Property, Rect, RectTuple, Rects, Scalar, Size, Sizing, Strings, Time, TimeRange, Timing, Track, UnknownRecord, VisibleInstance, VisibleInstanceObject } from '@moviemasher/runtime-shared'

import { ERROR, POINT_ZERO, TARGET_CLIP, errorThrow, isPopulatedString, isUndefined } from '@moviemasher/runtime-shared'
import { PropertiedClass } from '../../../Base/PropertiedClass.js'
import { DefaultContainerId } from '../../../Helpers/Container/ContainerConstants.js'
import { assertContainerInstance, isContainerInstance } from '../../../Helpers/Container/ContainerGuards.js'
import { DefaultContentId } from '../../../Helpers/Content/ContentConstants.js'
import { assertContentInstance, isContentInstance } from '../../../Helpers/Content/ContentGuards.js'
import { timeFromArgs, timeRangeFromArgs } from '../../../Helpers/Time/TimeUtilities.js'
import { DataTypeContainerId, DataTypeContentId, DataTypeFrame, DataTypeString } from '../../../Setup/DataTypeConstants.js'
import { Default } from '../../../Setup/Default.js'
import { DurationNone, DurationUnknown } from '../../../Setup/DurationConstants.js'
import { propertyInstance } from '../../../Setup/PropertyFunctions.js'
import { SizingContainer, SizingContent, SizingPreview, Sizings } from '../../../Setup/SizingConstants.js'
import { TimingContainer, TimingContent, TimingCustom, Timings } from '../../../Setup/TimingConstants.js'
import { idGenerateString } from '../../../Utility/IdFunctions.js'
import { assertAboveZero, assertDefined, assertPopulatedString, assertPositive, isAboveZero, isPropertyId } from '../../SharedGuards.js'
import { DOT } from '../../../Setup/Constants.js'
import { promiseNumbers } from '../../../Utility/PromiseFunctions.js'

export class ClipClass extends PropertiedClass implements Clip {
  constructor(object: ClipObject) {

    super(object)
    this.initializeProperties(object)
  }

  asset(_: string | AssetObject): Asset {
    errorThrow(ERROR.Unimplemented)
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
      if (timing === TimingContent && containerId) {
        this.timing = TimingContainer
      } else this.timing = TimingCustom
    }
    if (!sizingOk) {
      if (sizing === SizingContent && containerId) {
        this.sizing = SizingContainer 
      } else this.sizing = SizingPreview
    }
    return !(sizingOk && timingOk)
  }

  get audible(): boolean { return this.mutable }

  clipCachePromise(args: InstanceCacheArgs): Promise<DataOrError<number>> {
    const { content, container, frames } = this
    if (isAboveZero(frames)) args.clipTime ||= this.timeRange
    const promises = [content.instanceCachePromise(args)]
    if (container) promises.push(container.instanceCachePromise(args))
    // console.log(this.constructor.name, 'clipCachePromise', args, promises.length)
    return promiseNumbers(promises)
  }

  get clipObject(): ClipObject {
    const object: ClipObject = { ...this.scalarRecord }
    const { container, content } = this
    object.content = content.instanceObject
    if (container) {
      object.container = container.instanceObject
    } else object.containerId = ''
    // console.log(this.constructor.name, 'clipObject', object)
    return object
  }

  private _containerObject: InstanceObject = {}

  private _container?: VisibleInstance
  get container(): VisibleInstance | undefined { return this._container ||= this.containerInitialize }
  protected get containerInitialize(): VisibleInstance | undefined {
    const { containerId, _containerObject: containerObject } = this
    const assetId = containerId || containerObject.assetId
    if (!isPopulatedString(assetId)) return undefined

    // console.log(this.constructor.name, 'containerInitialize', assetId, containerId)
    const asset = this.asset(assetId)

    const object: VisibleInstanceObject  = { ...containerObject, assetId, container: true }
    const instance = asset.instanceFromObject(object)
    assertContainerInstance(instance)

    this.assureTimingAndSizing(TimingContainer, SizingContainer, instance)
    instance.clip = this
    if (this.timing === TimingContainer && this._track) this.resetTiming(instance)
    return instance
  }

  declare containerId: string

  containerRects(args: ContainerRectArgs): RectTuple {
    const { size, loading, editing } = args
    // console.log(this.constructor.name, 'rects rectIntrinsic', loading, editing)

    const intrinsicRect = this.rectIntrinsic(size, loading, editing)
    // console.log(this.constructor.name, 'ClipClass.containerRects intrinsicRect', intrinsicRect, args)
    const { container } = this
    assertContainerInstance(container)
    
    return container.containerRects(args, intrinsicRect)
  }

  private _contentObject: InstanceObject = {}
  
  get content() { return this._content ||= this.contentInitialize }
  
  private _content?: Instance
  
  protected get contentInitialize(): Instance {
    const { contentId, _contentObject: contentObject } = this
    const assetId = contentId || contentObject.assetId
    assertPopulatedString(assetId)

    // console.log(this.constructor.name, 'contentInitialize', assetId, contentId)

    const asset = this.asset(assetId)



    const object: InstanceObject = { ...contentObject, assetId }
    const content = asset.instanceFromObject(object)
    assertContentInstance(content)

    if (this.assureTimingAndSizing(TimingContent, SizingContent, content)) {
      const { container } = this
      if (container) {
        this.assureTimingAndSizing(TimingContainer, SizingContainer, container)
      }
    }

    content.clip = this

    if (this.timing === TimingContent && this._track) this.resetTiming(content)
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
    // console.log(this.constructor.name, 'initializeProperties', object)
    const { containerId, contentId, sizing, timing } = object
    const defaultContent = isUndefined(contentId) || contentId === DefaultContentId
    const defaultContainer = isUndefined(containerId) || containerId === DefaultContainerId

    if (defaultContent && !sizing) object.sizing = SizingContainer
    // if (defaultContainer && !sizing) object.sizing = SizingPreview
    if (defaultContent && !timing) object.timing = TimingContainer
    // if (defaultContainer && !timing) object.timing = TimingCustom
    
    
    this.properties.push(propertyInstance({ 
      targetId: TARGET_CLIP, name: 'label', type: DataTypeString, order: 1,
    }))
    this.properties.push(propertyInstance({
      targetId: TARGET_CLIP, name: 'containerId', type: DataTypeContainerId,
      defaultValue: DefaultContainerId, order: 5,
    }))
    this.properties.push(propertyInstance({
      targetId: TARGET_CLIP, name: 'contentId', type: DataTypeContentId,
      defaultValue: DefaultContentId, order: 5,
    }))
    this.properties.push(propertyInstance({ 
      targetId: TARGET_CLIP, name: 'sizing', type: DataTypeString, 
      defaultValue: SizingContent, options: Sizings, order: 2,
    }))
    this.properties.push(propertyInstance({ 
      targetId: TARGET_CLIP, name: 'timing', type: DataTypeString, 
      defaultValue: TimingContent, options: Timings, order: 3,
    }))
    this.properties.push(propertyInstance({ 
      targetId: TARGET_CLIP, name: 'frame', type: DataTypeFrame, 
      defaultValue: DurationNone, min: 0, step: 1, 
    }))
    this.properties.push(propertyInstance({ 
      targetId: TARGET_CLIP, name: 'frames', type: DataTypeFrame, 
      defaultValue: DurationUnknown, min: 1, step: 1, 
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

  maxFrames(_quantize : number, _trim? : number) : number { return 0 }

  get mutable(): boolean {
    const { content } = this
    const contentMutable = content.mutable()
    if (contentMutable) return true

    const { container } = this
    if (!container) return false
    const containerMutable = container.mutable()
    return  containerMutable
  }

  declare muted: boolean

  get notMuted(): boolean {
    const { content, muted } = this
    if (muted) return false

    if (content.mutable() && !content.muted) return true

    const { container } = this
    if (!container?.mutable()) return true

    return !container.muted
  }
  
  private rectIntrinsic(size: Size, loading?: boolean, editing?: boolean): Rect {
    const rect = { ...size, ...POINT_ZERO }
    const { sizing } = this
    // console.log(this.constructor.name, 'rectIntrinsic', sizing, loading, editing) 
    if (sizing === SizingPreview) return rect

    const target = sizing === SizingContainer ? this.container : this.content
    assertDefined(target)
    const known = target.intrinsicsKnown({ editing, size: true })
    if (loading && !known) return rect

    // assertTrue(known, `${target.constructor.name}.intrinsicsKnown`);

    return target.intrinsicRect(editing)
  }

  resetTiming(instance?: Instance, quantize?: number): void {
    const { timing } = this
    // console.log('resetTiming', timing)
    const track = this.track
    switch(timing) {
      case TimingCustom: {
        if (isAboveZero(this.frames)) break

        this.frames = Default.duration * (quantize || track!.mash.quantize)
        // console.log('resetTiming SET frames from custom', this.frames, { quantize })
        break
      }
      case TimingContainer: {
        const container = isContainerInstance(instance) ? instance : this.container
        if (!container) break
        if (!container.hasIntrinsicTiming) {
          // console.log(this.constructor.name, 'resetTiming SET timing from container to content')
          return this.setValue('timing', TimingContent)
        }
        this.frames = container.frames(quantize || track!.mash.quantize)
        // console.log('resetTiming SET frames from container', this.frames, { quantize })
        break
      }
      case TimingContent: {
        const content = isContentInstance(instance) ? instance : this.content
        if (!content) break

        if (!content.hasIntrinsicTiming) {
          // console.log(this.constructor.name, 'resetTiming SET timing content to custom')
          return this.setValue('timing', TimingCustom)
        }
        this.frames = content.frames(quantize || track!.mash.quantize)
        // console.log('resetTiming SET frames from content', this.frames, { quantize })
        break
      }
    }
  }

  override setValue(id: string, value?: Scalar, property?: Property): void {
    super.setValue(id, value, property)
    const name = isPropertyId(id) ? id.split(DOT).pop() : id
    switch (name) {
      case 'containerId': {
        // console.log(this.constructor.name, 'setValue', name, value, !!property)
        this._containerObject = this._container?.toJSON() || {}
        delete this._container
        break
      }
      case 'contentId': {
        // console.log(this.constructor.name, 'setValue', name, value, !!property)
        this._contentObject = this._content?.toJSON() || {}
        delete this._content
        break
      }
    }
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

  get visible(): boolean { return !!this.containerId }
}

