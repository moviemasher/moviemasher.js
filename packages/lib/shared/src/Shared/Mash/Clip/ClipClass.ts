import type { Clip, ClipObject, ContainerRectArgs, Instance, InstanceCacheArgs, InstanceObject, IntrinsicOptions, Property, Rect, RectTuple, Rects, Scalar, Size, Sizing, Strings, Time, TimeRange, Timing, Track, UnknownRecord, VisibleInstance, VisibleInstanceObject } from '@moviemasher/runtime-shared'

import { EventManagedAsset, MovieMasher, TypeClip, TypeContainer, TypeContent } from '@moviemasher/runtime-client'
import { assertAsset, isPopulatedString, isUndefined } from "@moviemasher/runtime-shared"

import { PropertiedClass } from '../../../Base/PropertiedClass.js'
import { DefaultContainerId } from '../../../Helpers/Container/ContainerConstants.js'
import { assertContainerInstance, isContainerInstance } from '../../../Helpers/Container/ContainerGuards.js'
import { DefaultContentId } from '../../../Helpers/Content/ContentConstants.js'
import { assertContentInstance, isContentInstance } from '../../../Helpers/Content/ContentGuards.js'
import { timeFromArgs, timeRangeFromArgs } from '../../../Helpers/Time/TimeUtilities.js'
import { DataTypeContainerId, DataTypeContentId, DataTypeFrame, DataTypeString } from '../../../Setup/DataTypeConstants.js'
import { Default } from '../../../Setup/Default.js'
import { DurationNone, DurationUnknown } from '../../../Setup/DurationConstants.js'
import { EmptyFunction } from '../../../Setup/EmptyFunction.js'
import { propertyInstance } from '../../../Setup/PropertyFunctions.js'
import { SizingContainer, SizingContent, SizingPreview, Sizings } from '../../../Setup/SizingConstants.js'
import { TimingContainer, TimingContent, TimingCustom, Timings } from '../../../Setup/TimingConstants.js'
import { idGenerateString } from '../../../Utility/IdFunctions.js'
import { POINT_ZERO } from '../../../Utility/PointConstants.js'
import { assertAboveZero, assertDefined, assertPopulatedString, assertPositive, assertTrue, isAboveZero } from '../../SharedGuards.js'

export class ClipClass extends PropertiedClass implements Clip {
  constructor(object: ClipObject) {
    const { containerId, contentId, sizing, timing } = object
    const defaultContent = isUndefined(contentId) || contentId === DefaultContentId
    const defaultContainer = isUndefined(containerId) || containerId === DefaultContainerId

    if (defaultContent && !sizing) object.sizing = SizingContainer
    if (defaultContainer && !sizing) object.sizing = SizingPreview
    if (defaultContent && !timing) object.timing = TimingContainer
    if (defaultContainer && !timing) object.timing = TimingCustom
    
    super(object)
    this.initializeProperties(object)
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

  clipCachePromise(args: InstanceCacheArgs): Promise<void> {
    const { content, container, frames } = this

    if (isAboveZero(frames)) args.clipTime ||= this.timeRange

    const promises = [content.instanceCachePromise(args)]

    if (container) promises.push(container.instanceCachePromise(args))
    return Promise.all(promises).then(EmptyFunction)
  }

  private _containerObject: InstanceObject = {}

  private _container?: VisibleInstance
  get container(): VisibleInstance | undefined { return this._container ||= this.containerInitialize }
  protected get containerInitialize(): VisibleInstance | undefined {
    const { containerId, _containerObject: containerObject } = this
    const assetId = containerId || containerObject.assetId
    if (!isPopulatedString(assetId)) return undefined

    const event = new EventManagedAsset(assetId)
    MovieMasher.eventDispatcher.dispatch(event)
    const definition = event.detail.asset
    assertAsset(definition, assetId)

    const object: VisibleInstanceObject  = { ...containerObject, assetId, container: true }
    const instance = definition.instanceFromObject(object)
    assertContainerInstance(instance)

    this.assureTimingAndSizing(TimingContainer, SizingContainer, instance)
    instance.clip = this
    if (this.timing === TimingContainer && this._track) this.resetTiming(instance)
    return instance
  }

  declare containerId: string

  private _contentObject: InstanceObject = {}
  
  get content() { return this._content ||= this.contentInitialize }
  
  private _content?: Instance
  
  protected get contentInitialize(): Instance {
    const { contentId, _contentObject: contentObject } = this
    const assetId = contentId || contentObject.assetId
    assertPopulatedString(assetId)

    const event = new EventManagedAsset(assetId)
    MovieMasher.eventDispatcher.dispatch(event)
    const definition = event.detail.asset
    assertAsset(definition, assetId)

    const object: InstanceObject = { ...contentObject, assetId }
    const instance = definition.instanceFromObject(object)
    assertContentInstance(instance)

    if (this.assureTimingAndSizing(TimingContent, SizingContent, instance)) {
      const { container } = this
      if (container) {
        this.assureTimingAndSizing(TimingContainer, SizingContainer, container)
      }
    }

    instance.clip = this

    if (this.timing === TimingContent && this._track) this.resetTiming(instance)
    return instance
  }

  declare contentId: string

  get assetIds(): Strings {
    const ids = this.content.assetIds
    if (this.container) ids.push(...this.container.assetIds)
    return ids
  }

  get endFrame() { return this.frame + this.frames }

  endTime(quantize : number) : Time {
    return timeFromArgs(this.endFrame, quantize)
  }

  declare frame: number

  declare frames: number
  
  override initializeProperties(object: ClipObject): void {
    this.properties.push(propertyInstance({
      targetId: TypeContainer, name: 'containerId', type: DataTypeContainerId,
      defaultValue: DefaultContainerId
    }))
    this.properties.push(propertyInstance({
      targetId: TypeContent, name: 'contentId', type: DataTypeContentId,
      defaultValue: DefaultContentId
    }))
    this.properties.push(propertyInstance({ 
      targetId: TypeClip, name: 'label', type: DataTypeString, 
    }))
    this.properties.push(propertyInstance({ 
      targetId: TypeClip, name: 'sizing', type: DataTypeString, 
      defaultValue: SizingContent, options: Sizings
    }))
    this.properties.push(propertyInstance({ 
      targetId: TypeClip, name: 'timing', type: DataTypeString, 
      defaultValue: TimingContent, options: Timings, 
    }))
    this.properties.push(propertyInstance({ 
      targetId: TypeClip, name: 'frame', type: DataTypeFrame, 
      defaultValue: DurationNone, min: 0, step: 1, 
    }))
    this.properties.push(propertyInstance({ 
      targetId: TypeClip, name: 'frames', type: DataTypeFrame, 
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
    if (container) known &&= container.intrinsicsKnown(options)
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
    
  rectIntrinsic(size: Size, loading?: boolean, editing?: boolean): Rect {
    const rect = { ...size, ...POINT_ZERO }
    const { sizing } = this
    // console.log(this.constructor.name, 'rectIntrinsic', sizing, loading, editing) 
    if (sizing === SizingPreview) return rect

    const target = sizing === SizingContainer ? this.container : this.content
    assertDefined(target)
    const known = target.intrinsicsKnown({ editing, size: true })
    if (loading && !known) return rect

    assertTrue(known, `${target.constructor.name}.intrinsicsKnown`);

    return target.intrinsicRect(editing)
  }

  rects(args: ContainerRectArgs): Rects {
    const { size, loading, editing } = args
    // console.log(this.constructor.name, 'rects rectIntrinsic', loading, editing)

    const intrinsicRect = this.rectIntrinsic(size, loading, editing)
    // console.log(this.constructor.name, 'rects intrinsicRect', intrinsicRect, args)
    const { container } = this
    assertContainerInstance(container)
    
    return container.containerRects(args, intrinsicRect)
  }

  resetTiming(instance?: Instance, quantize?: number): void {
    const { timing } = this
    // console.log('resetTiming', timing)
    const track = this.track
    switch(timing) {
      case TimingCustom: {
        
        // console.log('resetTiming', this.frames)
        if (isAboveZero(this.frames)) break

        this.frames = Default.duration * (quantize || track!.mash.quantize)
        break
      }
      case TimingContainer: {
        const container = isContainerInstance(instance) ? instance : this.container
        if (!container) break

        this.frames = container.frames(quantize || track!.mash.quantize)
        break
      }
      case TimingContent: {
        const content = isContentInstance(instance) ? instance : this.content
        if (!content) break

        this.frames = content.frames(quantize || track!.mash.quantize)
        break
      }
    }
  }

  setValue(name: string, value?: Scalar, property?: Property): void {
    super.setValue(name, value, property)
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
    json.contentId = content.assetId
    if (container) {
      json.container = container
      json.containerId = container.assetId
    } else json.containerId = ''
    return json
  }

  toString(): string { return `[Clip ${this.label}]` }

  track!: Track 

  get trackNumber(): number { return this.track ? this.track.index : -1 }

  set trackNumber(value: number) { if (value < 0) delete this._track }

  get visible(): boolean { return !!this.containerId }
}

